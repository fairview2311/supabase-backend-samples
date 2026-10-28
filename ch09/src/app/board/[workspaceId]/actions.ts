"use server";

import { eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { headers } from "next/headers";
import { attachments, invitations, tasks } from "@/db/schema";
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

export async function addAttachment(workspaceId: string, taskId: string, formData: FormData) {
  const file = formData.get("file") as File;
  if (file.size === 0) {
    return;
  }
  // Storage のファイル名には日本語を使えないので、場所は ID で決め、元の名前はテーブルに残す
  const extension = file.name.includes(".") ? `.${file.name.split(".").pop()}` : "";
  const path = `${workspaceId}/${taskId}/${crypto.randomUUID()}${extension}`;

  const supabase = await createClient();
  const { error } = await supabase.storage.from("attachments").upload(path, file, { contentType: file.type });
  if (error) {
    throw new Error(`ファイルをアップロードできませんでした: ${error.message}`);
  }
  await withUser((tx, user) =>
    tx.insert(attachments).values({ workspaceId, taskId, name: file.name, path, createdBy: user.id }),
  );
  refresh();
}

export async function deleteAttachment(attachmentId: string) {
  const [removed] = await withUser((tx) =>
    tx.delete(attachments).where(eq(attachments.id, attachmentId)).returning({ path: attachments.path }),
  );
  if (removed) {
    const supabase = await createClient();
    await supabase.storage.from("attachments").remove([removed.path]);
  }
  refresh();
}
