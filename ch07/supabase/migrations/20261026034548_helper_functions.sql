-- Custom SQL migration file, put your code below! --
-- ログインしている人が、そのワークスペースのメンバーかを調べる
create function public.is_workspace_member(ws uuid) returns boolean
language plpgsql stable security definer set search_path = '' as $$
begin
  return exists (
    select 1 from public.workspace_members as m
    where m.workspace_id = ws and m.user_id = (select auth.uid())
  );
end;
$$;

-- ログインしている人が、そのワークスペースの持ち主かを調べる
create function public.is_workspace_owner(ws uuid) returns boolean
language plpgsql stable security definer set search_path = '' as $$
begin
  return exists (
    select 1 from public.workspace_members as m
    where m.workspace_id = ws and m.user_id = (select auth.uid()) and m.role = 'owner'
  );
end;
$$;
