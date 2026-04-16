-- Schema Supabase para Matérias Exclusivas e Assinantes do Driver News

CREATE TABLE IF NOT EXISTS assinantes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo text NOT NULL,
  nome_exibicao text NOT NULL,
  categoria_piloto text,
  foto_perfil text,
  bio text,
  plano text DEFAULT 'starter',
  materias_publicadas_mes integer DEFAULT 0,
  ativo boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS materias_exclusivas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  subtitulo text,
  slug text NOT NULL UNIQUE,
  conteudo_markdown text NOT NULL,
  input_original jsonb,
  imagem_capa text NOT NULL,
  categoria text NOT NULL,
  autor_id uuid REFERENCES assinantes(id) ON DELETE CASCADE,
  aceite_publicacao_id uuid NOT NULL,
  publicado_em timestamp with time zone DEFAULT now(),
  status text DEFAULT 'publicada',
  visualizacoes integer DEFAULT 0
);

-- Índices otimizados
CREATE INDEX IF NOT EXISTS idx_materias_exclusivas_status ON materias_exclusivas(status);
CREATE INDEX IF NOT EXISTS idx_materias_exclusivas_slug ON materias_exclusivas(slug);
CREATE INDEX IF NOT EXISTS idx_assinantes_ativo ON assinantes(ativo);
