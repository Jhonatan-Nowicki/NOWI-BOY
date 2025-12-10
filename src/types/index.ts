export interface Usuario {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  cidade: string;
  meta_mensal_lucro: number | null;
  data_cadastro: string;
}

export interface Turno {
  id: string;
  usuario_id: string;
  data_inicio: string;
  data_fim: string | null;
  status: 'aberto' | 'fechado';
  tipo_turno: string | null;
  ganhos_total: number;
  gastos_total: number;
  lucro_total: number;
  criado_em: string;
}

export interface Ganho {
  id: string;
  usuario_id: string;
  turno_id: string | null;
  data: string;
  valor: number;
  tipo_trabalho: 'Marmita' | 'Pizzaria' | 'App' | 'Outro';
  bairro: string;
  forma_pagamento: 'Pix' | 'Dinheiro' | 'Cartão' | 'App';
  observacao: string | null;
  criado_em: string;
}

export interface Gasto {
  id: string;
  usuario_id: string;
  turno_id: string | null;
  data: string;
  valor: number;
  categoria: 'Combustível' | 'Manutenção' | 'Óleo' | 'Imprevistos' | 'Multa' | 'Outros';
  descricao: string;
  criado_em: string;
}

export interface Entrega {
  id: string;
  usuario_id: string;
  turno_id: string | null;
  data: string;
  valor: number | null;
  endereco: string;
  bairro: string;
  referencia: string | null;
  observacao: string | null;
  criado_em: string;
}

export interface DashboardResumo {
  total_ganhos: number;
  total_gastos: number;
  lucro_liquido: number;
  progresso_meta: number;
  dados_grafico: { data: string; ganhos: number; gastos: number; lucro: number }[];
}

export interface TurnoAtual {
  turno: Turno | null;
  ganhos_total_turno: number;
  gastos_total_turno: number;
  lucro_turno: number;
}
