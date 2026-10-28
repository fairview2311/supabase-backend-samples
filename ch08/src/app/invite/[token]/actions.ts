"use server";

import { sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { withUser } from "@/lib/db/with-user";

export async function acceptInvitation(token: string) {
  let workspaceId: string;
  try {
    const rows = await withUser((tx) =>
      tx.execute<{ workspace_id: string }>(sql`select public.accept_invitation(${token}) as workspace_id`),
    );
    workspaceId = rows[0].workspace_id;
  } catch {
    redirect(`/invite/${token}?error=1`);
  }
  redirect(`/board/${workspaceId}`);
}
