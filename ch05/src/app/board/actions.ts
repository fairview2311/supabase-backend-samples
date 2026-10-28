"use server";

import { redirect } from "next/navigation";
import { workspaces } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function createWorkspace(formData: FormData) {
  const user = await requireUser();
  const [workspace] = await db
    .insert(workspaces)
    .values({ name: String(formData.get("name")), createdBy: user.id })
    .returning({ id: workspaces.id });

  redirect(`/board/${workspace.id}`);
}
