-- Tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  cidade TEXT,
  meta_mensal_lucro DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- RLS para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Tabela de bairros com taxas fixas
CREATE TABLE public.bairros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  taxa DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.bairros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bairros"
ON public.bairros FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bairros"
ON public.bairros FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bairros"
ON public.bairros FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bairros"
ON public.bairros FOR DELETE
USING (auth.uid() = user_id);

-- Tabela de estabelecimentos com diária
CREATE TABLE public.estabelecimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  diaria DECIMAL(10,2) NOT NULL DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.estabelecimentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own estabelecimentos"
ON public.estabelecimentos FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own estabelecimentos"
ON public.estabelecimentos FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own estabelecimentos"
ON public.estabelecimentos FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own estabelecimentos"
ON public.estabelecimentos FOR DELETE
USING (auth.uid() = user_id);

-- Tabela de turnos
CREATE TABLE public.turnos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  estabelecimento_id UUID REFERENCES public.estabelecimentos(id) ON DELETE SET NULL,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_fim TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'aberto' CHECK (status IN ('aberto', 'fechado')),
  tipo_turno TEXT,
  ganhos_total DECIMAL(10,2) DEFAULT 0,
  gastos_total DECIMAL(10,2) DEFAULT 0,
  lucro_total DECIMAL(10,2) DEFAULT 0,
  diaria DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.turnos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own turnos"
ON public.turnos FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own turnos"
ON public.turnos FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own turnos"
ON public.turnos FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own turnos"
ON public.turnos FOR DELETE
USING (auth.uid() = user_id);

-- Tabela de entregas
CREATE TABLE public.entregas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  turno_id UUID REFERENCES public.turnos(id) ON DELETE SET NULL,
  estabelecimento_id UUID REFERENCES public.estabelecimentos(id) ON DELETE SET NULL,
  bairro_id UUID REFERENCES public.bairros(id) ON DELETE SET NULL,
  endereco TEXT NOT NULL,
  bairro_nome TEXT,
  taxa DECIMAL(10,2) DEFAULT 0,
  referencia TEXT,
  observacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.entregas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own entregas"
ON public.entregas FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entregas"
ON public.entregas FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entregas"
ON public.entregas FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entregas"
ON public.entregas FOR DELETE
USING (auth.uid() = user_id);

-- Tabela de ganhos
CREATE TABLE public.ganhos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  turno_id UUID REFERENCES public.turnos(id) ON DELETE SET NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  valor DECIMAL(10,2) NOT NULL,
  tipo_trabalho TEXT NOT NULL CHECK (tipo_trabalho IN ('Marmita', 'Pizzaria', 'App', 'Outro')),
  bairro TEXT,
  forma_pagamento TEXT NOT NULL CHECK (forma_pagamento IN ('Pix', 'Dinheiro', 'Cartão', 'App')),
  observacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.ganhos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own ganhos"
ON public.ganhos FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ganhos"
ON public.ganhos FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ganhos"
ON public.ganhos FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ganhos"
ON public.ganhos FOR DELETE
USING (auth.uid() = user_id);

-- Tabela de gastos
CREATE TABLE public.gastos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  turno_id UUID REFERENCES public.turnos(id) ON DELETE SET NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  valor DECIMAL(10,2) NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('Combustível', 'Manutenção', 'Óleo', 'Imprevistos', 'Multa', 'Outros')),
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.gastos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own gastos"
ON public.gastos FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own gastos"
ON public.gastos FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gastos"
ON public.gastos FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gastos"
ON public.gastos FOR DELETE
USING (auth.uid() = user_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger para profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();