-- Custom SQL migration file, put your code below! --
-- ワークスペースを作成した人を、持ち主（owner）としてメンバーに追加する
create function public.add_workspace_owner() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.workspace_members (workspace_id, user_id, email, role)
  select new.id, new.created_by, u.email, 'owner'
  from auth.users as u
  where u.id = new.created_by;
  return new;
end;
$$;

create trigger on_workspace_created
after insert on public.workspaces
for each row execute function public.add_workspace_owner();
