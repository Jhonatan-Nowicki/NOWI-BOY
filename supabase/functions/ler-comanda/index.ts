import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, bairros } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!imageBase64) {
      throw new Error("Imagem não fornecida");
    }

    // Build the bairros list for the prompt
    const bairrosLista = bairros && bairros.length > 0
      ? bairros.map((b: { nome: string; taxa: number }) => `${b.nome}: R$${b.taxa.toFixed(2)}`).join(", ")
      : "Nenhum bairro cadastrado";

    console.log("Analyzing comanda image with AI...");
    console.log("Bairros disponíveis:", bairrosLista);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Você é um assistente especializado em ler comandas de entrega de motoboy.
Analise a imagem da comanda e extraia as seguintes informações:
- endereco: o endereço completo de entrega
- bairro: o bairro/região da entrega
- referencia: ponto de referência se houver
- observacao: qualquer observação adicional

Os bairros cadastrados com suas taxas são: ${bairrosLista}

Se identificar um bairro que corresponda aos cadastrados, use o nome exato do bairro cadastrado.

Responda APENAS com um objeto JSON válido no formato:
{
  "endereco": "endereço extraído",
  "bairro": "bairro identificado",
  "referencia": "referência se houver ou null",
  "observacao": "observação se houver ou null",
  "confianca": "alta/media/baixa"
}

Se não conseguir identificar algum campo, use null.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analise esta comanda de entrega e extraia as informações:"
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao seu workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`Erro no gateway AI: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI Response:", content);

    // Parse the JSON response
    let parsed;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return new Response(JSON.stringify({ 
        error: "Não foi possível extrair as informações da comanda. Tente uma foto mais clara.",
        raw: content 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find the matching bairro and its taxa
    let taxa = 0;
    if (parsed.bairro && bairros) {
      const bairroMatch = bairros.find((b: { nome: string }) => 
        b.nome.toLowerCase() === parsed.bairro.toLowerCase()
      );
      if (bairroMatch) {
        taxa = bairroMatch.taxa;
        parsed.bairro = bairroMatch.nome; // Use exact name
      }
    }

    return new Response(JSON.stringify({ 
      ...parsed,
      taxa,
      success: true 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in ler-comanda function:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
