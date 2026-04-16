-- Schema Supabase para o Agregador Driver News (Open Graph)

CREATE TABLE IF NOT EXISTS noticias_agregadas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  og_image_url text NOT NULL,
  link_original text NOT NULL UNIQUE,
  portal_origem text NOT NULL,
  categoria text,
  og_description text,
  publicado_em timestamp with time zone,
  ingerido_em timestamp with time zone DEFAULT now(),
  ativo boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS ingestao_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_origem text NOT NULL,
  url_requisitada text NOT NULL,
  status_http integer,
  sucesso boolean NOT NULL,
  erro text,
  quantidade_itens_novos integer DEFAULT 0,
  executado_em timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dominios_bloqueados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dominio text NOT NULL UNIQUE,
  motivo text,
  bloqueado_em timestamp with time zone DEFAULT now()
);

-- Índices otimizados
CREATE INDEX IF NOT EXISTS idx_noticias_agregadas_ativo ON noticias_agregadas(ativo);
CREATE INDEX IF NOT EXISTS idx_noticias_agregadas_publicado ON noticias_agregadas(publicado_em DESC);
CREATE INDEX IF NOT EXISTS idx_noticias_agregadas_portal ON noticias_agregadas(portal_origem);
