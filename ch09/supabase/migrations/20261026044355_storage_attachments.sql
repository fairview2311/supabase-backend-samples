-- Custom SQL migration file, put your code below! --
-- 添付ファイルを保存するバケット（公開しない。1ファイル 4MB まで）
insert into storage.buckets (id, name, public, file_size_limit)
values ('attachments', 'attachments', false, 4194304);

-- ファイルの場所は「ワークスペースの ID/タスクの ID/ファイル名」。最初のフォルダーのワークスペースのメンバーだけが扱える
create policy "メンバーが添付を読み取れる" on storage.objects for select to authenticated
using (bucket_id = 'attachments' and public.is_workspace_member((storage.foldername(name))[1]::uuid));

create policy "メンバーが添付をアップロードできる" on storage.objects for insert to authenticated
with check (bucket_id = 'attachments' and public.is_workspace_member((storage.foldername(name))[1]::uuid));

create policy "アップロードした人か持ち主が添付を削除できる" on storage.objects for delete to authenticated
using (bucket_id = 'attachments' and ((select auth.uid())::text = owner_id or public.is_workspace_owner((storage.foldername(name))[1]::uuid)));
