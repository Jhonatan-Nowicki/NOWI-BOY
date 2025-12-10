import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Bairro } from '@/hooks/useSupabaseData';
import { toast } from 'sonner';

interface LeitorComandaProps {
  bairros: Bairro[];
  onDataExtracted: (data: {
    endereco: string;
    bairro: string;
    taxa: number;
    referencia: string | null;
    observacao: string | null;
  }) => void;
}

export function LeitorComanda({ bairros, onDataExtracted }: LeitorComandaProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const imageBase64 = await base64Promise;
      
      setPreviewUrl(imageBase64);

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('ler-comanda', {
        body: {
          imageBase64,
          bairros: bairros.map(b => ({ nome: b.nome, taxa: b.taxa }))
        }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      // Pass extracted data to parent
      onDataExtracted({
        endereco: data.endereco || '',
        bairro: data.bairro || '',
        taxa: data.taxa || 0,
        referencia: data.referencia,
        observacao: data.observacao
      });

      toast.success('Comanda lida com sucesso!', {
        description: data.confianca === 'alta' ? 'Alta confiança na leitura' : 'Verifique os dados extraídos'
      });

    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Erro ao processar imagem');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  return (
    <div className="glass-card p-4 lg:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold">Leitor de Comanda (IA)</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Tire uma foto da comanda ou faça upload para extrair automaticamente o endereço e a taxa.
      </p>

      <div className="flex gap-2 mb-4">
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => cameraInputRef.current?.click()}
          disabled={isProcessing}
        >
          <Camera className="w-4 h-4 mr-2" />
          Câmera
        </Button>
        
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
        >
          <Upload className="w-4 h-4 mr-2" />
          Galeria
        </Button>
      </div>

      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-8"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3">Analisando comanda...</span>
        </motion.div>
      )}

      {previewUrl && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-lg overflow-hidden"
        >
          <img
            src={previewUrl}
            alt="Preview da comanda"
            className="w-full h-48 object-cover rounded-lg"
          />
        </motion.div>
      )}
    </div>
  );
}
