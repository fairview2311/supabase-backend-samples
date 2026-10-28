"use server";

import { eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { headers } from "next/headers";
import { invitations, tasks } from "@/db/schema";
import { withUser } from "@/lib/db/with-user";
import { createClient } from "@/lib/supabase/server";

type Status = "todo" | "doing" | "done";

export async function addTask(workspaceId: string, formData: FormData) {
  await withUser((tx, user) =>
    tx.insert(tasks).values({
      workspaceId,
      title: String(formData.get("title")),
      createdBy: user.id,
    }),
  );
  refresh();
}

export async function moveTask(taskId: string, status: Status) {
  await withUser((tx) => tx.update(tasks).set({ status }).where(eq(tasks.id, taskId)));
  refresh();
}

export async function assignTask(taskId: string, formData: FormData) {
  const assigneeId = String(formData.get("assigneeId"));
  await withUser((tx) =>
    tx
      .update(tasks)
      .set({ assigneeId: assigneeId === "" ? null : assigneeId })
      .where(eq(tasks.id, taskId)),
  );
  refresh();
}

export async function deleteTask(taskId: string) {
  await withUser((tx) => tx.delete(tasks).where(eq(tasks.id, taskId)));
  refresh();
}

export async function inviteMember(workspaceId: string, formData: FormData) {
  const email = String(formData.get("email"));
  const [invitation] = await withUser((tx, user) =>
    tx
      .insert(invitations)
      .values({ workspaceId, email, invitedBy: user.id })
      .returning({ token: invitations.token }),
  );

  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/invite/${invitation.token}` },
  });
  refresh();
}
