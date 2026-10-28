CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"email" text NOT NULL,
	"token" uuid DEFAULT gen_random_uuid() NOT NULL,
	"invited_by" uuid NOT NULL,
	"accepted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "invitations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "持ち主が招待を読み取れる" ON "invitations" AS PERMISSIVE FOR SELECT TO "authenticated" USING (public.is_workspace_owner("invitations"."workspace_id"));--> statement-breakpoint
CREATE POLICY "持ち主が招待を作成できる" ON "invitations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (public.is_workspace_owner("invitations"."workspace_id"));--> statement-breakpoint
CREATE POLICY "持ち主が招待を削除できる" ON "invitations" AS PERMISSIVE FOR DELETE TO "authenticated" USING (public.is_workspace_owner("invitations"."workspace_id"));