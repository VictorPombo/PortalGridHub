CREATE TABLE IF NOT EXISTS press_release_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    feed_url TEXT NOT NULL,
    feed_tipo TEXT NOT NULL, -- 'pr_wire' | 'oficial_strict' | 'oficial_news'
    source_name TEXT NOT NULL,
    category TEXT NOT NULL,
    item_guid TEXT NOT NULL UNIQUE,
    original_title TEXT NOT NULL,
    pt_title TEXT NOT NULL,
    original_lang TEXT NOT NULL DEFAULT 'pt',
    was_translated BOOLEAN NOT NULL DEFAULT false,
    item_url TEXT NOT NULL,
    image_url TEXT NOT NULL,
    image_source TEXT, -- 'enclosure' | 'media_content' | 'media_thumbnail'
    excerpt_pt TEXT,
    published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_pr_date ON press_release_logs (fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_pr_category ON press_release_logs (category);
CREATE INDEX IF NOT EXISTS idx_pr_source ON press_release_logs (source_name);
CREATE INDEX IF NOT EXISTS idx_pr_tipo ON press_release_logs (feed_tipo);

COMMENT ON TABLE press_release_logs IS 'Log completo de press releases — prova de boa-fé. Marco Civil da Internet Art. 19 · LGPD legítimo interesse · Retenção 5 anos.';

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
