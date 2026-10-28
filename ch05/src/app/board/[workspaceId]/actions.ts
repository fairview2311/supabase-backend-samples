"use server";

import { eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { tasks } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

type Status = "todo" | "doing" | "done";

export async function addTask(workspaceId: string, formData: FormData) {
  const user = await requireUser();
  await db.insert(tasks).values({
    workspaceId,
    title: String(formData.get("title")),
    createdBy: user.id,
  });
  refresh();
}

export async function moveTask(taskId: string, status: Status) {
  await requireUser();
  await db.update(tasks).set({ status }).where(eq(tasks.id, taskId));
  refresh();
}

export async function assignTask(taskId: string, formData: FormData) {
  await requireUser();
  const assigneeId = String(formData.get("assigneeId"));
  await db
    .update(tasks)
    .set({ assigneeId: assigneeId === "" ? null : assigneeId })
    .where(eq(tasks.id, taskId));
  refresh();
}

export async function deleteTask(taskId: string) {
  await requireUser();
  await db.delete(tasks).where(eq(tasks.id, taskId));
  refresh();
}
