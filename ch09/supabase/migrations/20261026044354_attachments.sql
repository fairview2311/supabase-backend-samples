CREATE TABLE "attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"task_id" uuid NOT NULL,
	"name" text NOT NULL,
	"path" text NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "attachments_path_unique" UNIQUE("path")
);
--> statement-breakpoint
ALTER TABLE "attachments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "メンバーが添付を読み取れる" ON "attachments" AS PERMISSIVE FOR SELECT TO "authenticated" USING (public.is_workspace_member("attachments"."workspace_id"));--> statement-breakpoint
CREATE POLICY "メンバーが添付を追加できる" ON "attachments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (public.is_workspace_member("attachments"."workspace_id"));--> statement-breakpoint
CREATE POLICY "添付した人か持ち主が添付を削除できる" ON "attachments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "attachments"."created_by" or public.is_workspace_owner("attachments"."workspace_id"));