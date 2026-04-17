-- ==========================================
-- PITLANE NEWS: SUPABASE INITIALIZATION DB
-- ==========================================

-- 1. Criação da Tabela USERS (Pilotos, Equipes, Categorias)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  type text NOT NULL,
  plan text NOT NULL,
  number text,
  category text,
  avatar text,
  bio text,
  instagram text,
  whatsapp text,
  pilot_name text,
  team text,
  city text,
  dob text,
  career text,
  last_race text,
  next_race text,
  goals text,
  sponsors text,
  sponsor_message text,
  flag text,
  conquests jsonb,
  social jsonb,
  referred_by text,
  password_hash text,
  created_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'active'
);

-- Adiciona a coluna caso a tabela já exista de comandos anteriores
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash text;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referred_by text;
-- 2. Criação da Tabela ARTICLES (Feed do SaaS e Admin)
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  brief text,
  body text,
  img text,
  status text DEFAULT 'review',
  published_at timestamp with time zone,
  submitted_at timestamp with time zone DEFAULT now(),
  views integer DEFAULT 0,
  category text
);

-- Habilitar RLS nas tabelas mas deixando uma regra inicial "pública"-- Ativar segurança
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Políticas super permissivas (temporárias para desenvolvimento)
DROP POLICY IF EXISTS "Acesso público temporário User Leitura" ON public.users;
CREATE POLICY "Acesso público temporário User Leitura" ON public.users
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Acesso público temporário User Escrita" ON public.users;
CREATE POLICY "Acesso público temporário User Escrita" ON public.users
FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso público temporário Article Leitura" ON public.articles;
CREATE POLICY "Acesso público temporário Article Leitura" ON public.articles
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Acesso público temporário Article Escrita" ON public.articles;
CREATE POLICY "Acesso público temporário Article Escrita" ON public.articles
FOR ALL USING (true);

-- 3. SEEDING Inicial (Mock Data Localizados para Vendas SaaS)
-- Inserindo alguns Usuários chaves
INSERT INTO public.users (id, name, email, type, plan, number, category, avatar, flag, referred_by, status) VALUES
('b0d74e3a-0b2f-48d6-8bfc-31a89c8a99a1', 'Rafael Mendes', 'rafael@mendes.com', 'piloto', 'pro', '07', 'Stock Car', 'RM', '🇧🇷', null, 'active'),
('b0d74e3a-0b2f-48d6-8bfc-31a89c8a99a2', 'Lucas Andrade', 'lucas@andrade.com', 'piloto', 'starter', '22', 'F4 Brasil', 'LA', '🇧🇷', 'RAFAELMENDES', 'active'),
('b0d74e3a-0b2f-48d6-8bfc-31a89c8a99a3', 'Camila Torres', 'camila@torres.com', 'piloto', 'starter', '33', 'Porsche Cup', 'CT', '🇧🇷', null, 'active'),
('b0d74e3a-0b2f-48d6-8bfc-31a89c8a99a4', 'Pedro Silva', 'pedro@silva.com', 'piloto', 'pro', '88', 'Sim Racing', 'PS', '🇧🇷', null, 'active'),
('b0d74e3a-0b2f-48d6-8bfc-31a89c8a99a5', 'Thunder Racing', 'contato@thunderracing.com', 'equipe', 'equipe', null, 'Stock Car', 'TR', '🇧🇷', null, 'active'),
('b0d74e3a-0b2f-48d6-8bfc-31a89c8a99a6', 'Categoria F4 Brasil', 'contato@f4.com', 'categoria', 'categoria', null, 'F4 Brasil', 'F4', '🇧🇷', null, 'active'),
('admin-user-id-0000-0000-000000000000', 'Victor Assis', 'victordeassis2010@hotmail.com', 'admin', 'admin', null, null, 'VA', '🇧🇷', null, 'active')
ON CONFLICT (id) DO NOTHING;

-- Definindo a senha para a conta admin
UPDATE public.users SET password_hash = '5f1e157a8175031a882c1ca2cbe29de75348b91fd1145b5154c4648df7018f11' WHERE email = 'victordeassis2010@hotmail.com';

-- Inserindo Artigos Iniciais
INSERT INTO public.articles (author_id, title, brief, body, img, status, published_at, views, category) VALUES
('b0d74e3a-0b2f-48d6-8bfc-31a89c8a99a1', 'Equipe Thunder Racing oficializa novo patrocinador master para o Campeonato Paulista', 'Nova parceria garante investimento crucial para a disputa do título na F1600.', '<p>Assinamos oficialmente o contrato com nosso novo patrocinador master para a temporada completa.</p>', 'https://loremflickr.com/760/320/racing,sponsor?lock=100', 'published', '2026-04-10', 2340, 'Stock Car'),
('b0d74e3a-0b2f-48d6-8bfc-31a89c8a99a2', 'Vitória épica! Lucas Andrade larga em 5º e ganha a corrida em Interlagos sob chuva', 'Piloto paulista escala o grid sob forte chuva e conquista o lugar mais alto do pódio.', '<p>Que corrida emocionante.</p>', 'https://loremflickr.com/760/320/interlagos,podium?lock=101', 'published', '2026-04-09', 1890, 'F4 Brasil'),
('b0d74e3a-0b2f-48d6-8bfc-31a89c8a99a6', 'MUDANÇAS NO REGULAMENTO: Categoria F4 anuncia novidades e teto de gastos', 'Focada em equilibrar os times menores com as grandes estruturas.', '<p>Novas regras para a temporada de 2027.</p>', 'https://loremflickr.com/760/320/documents,rules?lock=202', 'published', '2026-04-08', 4120, 'F4 Brasil'),
('b0d74e3a-0b2f-48d6-8bfc-31a89c8a99a5', 'Apex Engineering abre novo programa de Sim Racing para selecionar pilotos', 'Os pilotos virtuais mais rápidos ganharão testes num F4.', '<p>Vagas abertas para inscritos do pacote Starter!</p>', 'https://loremflickr.com/760/320/simracing,wheel?lock=203', 'published', '2026-04-07', 3150, 'Sim Racing');
