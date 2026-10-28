ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "workspace_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "workspaces" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "メンバーが読み取れる" ON "tasks" AS PERMISSIVE FOR SELECT TO "authenticated" USING (public.is_workspace_member("tasks"."workspace_id"));--> statement-breakpoint
CREATE POLICY "メンバーが作成できる" ON "tasks" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (public.is_workspace_member("tasks"."workspace_id"));--> statement-breakpoint
CREATE POLICY "メンバーが変更できる" ON "tasks" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (public.is_workspace_member("tasks"."workspace_id"));--> statement-breakpoint
CREATE POLICY "作成者か持ち主が削除できる" ON "tasks" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "tasks"."created_by" or public.is_workspace_owner("tasks"."workspace_id"));--> statement-breakpoint
CREATE POLICY "同じワークスペースの人が読み取れる" ON "workspace_members" AS PERMISSIVE FOR SELECT TO "authenticated" USING (public.is_workspace_member("workspace_members"."workspace_id"));--> statement-breakpoint
CREATE POLICY "持ち主がメンバーを追加できる" ON "workspace_members" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (public.is_workspace_owner("workspace_members"."workspace_id"));--> statement-breakpoint
CREATE POLICY "持ち主がメンバーを削除できる" ON "workspace_members" AS PERMISSIVE FOR DELETE TO "authenticated" USING (public.is_workspace_owner("workspace_members"."workspace_id"));--> statement-breakpoint
CREATE POLICY "メンバーが読み取れる" ON "workspaces" AS PERMISSIVE FOR SELECT TO "authenticated" USING (public.is_workspace_member("workspaces"."id"));--> statement-breakpoint
CREATE POLICY "ログインした人が作成できる" ON "workspaces" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "workspaces"."created_by");--> statement-breakpoint
CREATE POLICY "持ち主が名前を変更できる" ON "workspaces" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (public.is_workspace_owner("workspaces"."id"));--> statement-breakpoint
CREATE POLICY "持ち主が削除できる" ON "workspaces" AS PERMISSIVE FOR DELETE TO "authenticated" USING (public.is_workspace_owner("workspaces"."id"));