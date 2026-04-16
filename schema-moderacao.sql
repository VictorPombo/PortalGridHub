-- Schema Supabase para o fluxo de moderação, auditoria de IA e Aceites Jurídicos

-- Modificando a tabela materias_exclusivas (criada na separação visual)
ALTER TABLE materias_exclusivas ADD COLUMN IF NOT EXISTS versao_ia text;
ALTER TABLE materias_exclusivas ADD COLUMN IF NOT EXISTS versao_final text;
ALTER TABLE materias_exclusivas ADD COLUMN IF NOT EXISTS modelo_ia text;
ALTER TABLE materias_exclusivas ADD COLUMN IF NOT EXISTS prompt_sistema_id uuid;

CREATE TABLE IF NOT EXISTS prompts_sistema (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  versao text NOT NULL UNIQUE,
  texto_prompt text NOT NULL,
  ativo boolean DEFAULT false,
  criado_em timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS aceites_publicacao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  materia_id uuid REFERENCES materias_exclusivas(id) ON DELETE RESTRICT,
  assinante_id uuid REFERENCES assinantes(id) ON DELETE RESTRICT,
  declaracao_texto text NOT NULL,
  aceite_veracidade boolean NOT NULL,
  aceite_responsabilidade boolean NOT NULL,
  aceite_isencao boolean NOT NULL,
  ip_aceite text,
  user_agent text,
  timestamp_aceite timestamp with time zone DEFAULT now(),
  hash_conteudo text NOT NULL
);

CREATE TABLE IF NOT EXISTS logs_ia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  materia_id uuid REFERENCES materias_exclusivas(id) ON DELETE CASCADE,
  tipo text NOT NULL, -- Enum: 'geracao' | 'regeneracao' | 'edicao_piloto'
  input jsonb NOT NULL,
  output text NOT NULL,
  modelo text NOT NULL,
  tokens_input integer DEFAULT 0,
  tokens_output integer DEFAULT 0,
  custo_estimado numeric(10,4),
  executado_em timestamp with time zone DEFAULT now()
);

-- Inserindo Prompt Inicial Base V1
INSERT INTO prompts_sistema (versao, texto_prompt, ativo) VALUES (
  'v1.0.0', 
  'Você é um redator jornalístico especializado em automobilismo. Receberá informações fornecidas por um piloto ou profissional e deve transformá-las em uma matéria jornalística.

REGRAS:
1. APENAS as informações fornecidas. Nunca invente dados.
2. Tom jornalístico imparcial.
3. Citações exatamente como fornecidas entre aspas.
4. Estrutura: título impactante, subtítulo, 3-6 parágrafos.
5. Seja genérico ao preencher vazios, não emita opiniões pessoais.
6. Formato de Saída OBRIGATÓRIO:
TÍTULO: [título]
SUBTÍTULO: [subtítulo]
CORPO:
[corpo]', 
  true
) ON CONFLICT DO NOTHING;
