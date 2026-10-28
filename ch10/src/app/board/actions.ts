"use server";

import { redirect } from "next/navigation";
import { workspaces } from "@/db/schema";
import { withUser } from "@/lib/db/with-user";

export async function createWorkspace(formData: FormData) {
  const [workspace] = await withUser((tx, user) =>
    tx
      .insert(workspaces)
      .values({ name: String(formData.get("name")), createdBy: user.id })
      .returning({ id: workspaces.id }),
  );

  redirect(`/board/${workspace.id}`);
}
