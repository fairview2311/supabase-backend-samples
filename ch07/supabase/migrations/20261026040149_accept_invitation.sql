-- Custom SQL migration file, put your code below! --
-- 招待を承諾する。ログインしている人のメールアドレスが招待の宛先と同じときだけ、メンバーに追加する
create function public.accept_invitation(invite_token uuid) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  invitation public.invitations;
  user_email text := (select auth.jwt() ->> 'email');
begin
  select * into invitation from public.invitations
  where token = invite_token
    and accepted_at is null
    and lower(email) = lower(user_email);

  if invitation.id is null then
    raise exception '招待が見つからないか、宛先が違います';
  end if;

  insert into public.workspace_members (workspace_id, user_id, email, role)
  values (invitation.workspace_id, (select auth.uid()), user_email, 'member')
  on conflict do nothing;

  update public.invitations set accepted_at = now() where id = invitation.id;

  return invitation.workspace_id;
end;
$$;

-- ログインした人だけが呼べるようにする
revoke execute on function public.accept_invitation(uuid) from public, anon;
grant execute on function public.accept_invitation(uuid) to authenticated;
