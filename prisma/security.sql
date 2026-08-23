-- ===========================================================================
-- Endurecimento de permissoes no Supabase
--
-- Contexto: o Supabase expoe o schema `public` na internet atraves do
-- PostgREST (https://<ref>.supabase.co/rest/v1/...) usando a chave anon, que
-- e publica por design. Hoje o acesso ja e barrado pelo RLS — todas as
-- tabelas tem RLS ligado e nenhuma politica, o que significa negar tudo.
--
-- O problema e que essa protecao depende de uma unica condicao continuar
-- verdadeira. Basta alguem criar uma politica permissiva "para testar", ou
-- uma tabela escapar do event trigger `ensure_rls`, para os dados vazarem.
--
-- Esta aplicacao nunca usa PostgREST: todo acesso passa pelo Prisma,
-- conectado como `postgres`. Entao os papeis anon/authenticated nao precisam
-- de privilegio nenhum aqui. Removendo os GRANTs, o vazamento deixa de
-- depender do RLS e passa a ser impossivel por construcao.
--
-- Aplicar com:  npm run db:harden
--
-- Para reverter (se um dia quiser usar o supabase-js no navegador):
--   GRANT USAGE ON SCHEMA public TO anon, authenticated;
--   GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
--   ... e crie politicas RLS explicitas para cada tabela.
-- ===========================================================================

-- Privilegios ja concedidos
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public FROM anon, authenticated;
REVOKE USAGE ON SCHEMA public FROM anon, authenticated;

-- Objetos futuros: sem isso, a proxima tabela criada pelo `prisma db push`
-- nasceria com os GRANTs padrao de volta.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE ALL ON FUNCTIONS FROM anon, authenticated;

-- Garante RLS ligado mesmo que o event trigger do Supabase falhe em algum
-- momento. Com os GRANTs revogados isso e redundante — e redundancia aqui e
-- exatamente o que se quer.
DO $$
DECLARE t record;
BEGIN
  FOR t IN
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r' AND NOT c.relrowsecurity
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.relname);
    RAISE NOTICE 'RLS ligado em %', t.relname;
  END LOOP;
END $$;
