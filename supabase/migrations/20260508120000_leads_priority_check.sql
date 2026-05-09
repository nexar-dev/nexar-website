-- Alinha `public.leads.priority` com `LEAD_PRIORITY_DB_VALUES` em lib/questionnaire-data.ts
-- Erro típico sem este passo: new row for relation "leads" violates check constraint "leads_priority_check"
--
-- Aplicar no Supabase: SQL Editor → colar e executar.

ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_priority_check;

ALTER TABLE public.leads
  ADD CONSTRAINT leads_priority_check CHECK (
    priority IN (
      'Quero o quanto antes',
      'Quero entender melhor primeiro',
      'Estou pesquisando possibilidades',
      'Quero desenvolver nos próximos meses',
      'Ainda não sei',
      'Outro'
    )
  );
