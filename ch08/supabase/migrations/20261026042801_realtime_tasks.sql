-- Custom SQL migration file, put your code below! --
-- tasks の変更を Realtime で届ける
alter publication supabase_realtime add table public.tasks;
