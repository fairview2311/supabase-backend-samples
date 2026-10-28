import Link from "next/link";
import { Suspense } from "react";
import { logout } from "@/app/login/actions";
import { workspaces } from "@/db/schema";
import { withUser } from "@/lib/db/with-user";
import { createWorkspace } from "./actions";

async function WorkspaceList() {
  const { user, rows } = await withUser(async (tx, user) => ({
    user,
    rows: await tx.select().from(workspaces).orderBy(workspaces.createdAt),
  }));

  return (
    <>
      <p className="mb-6 text-sm text-zinc-600">{user.email} でログインしています</p>
      <ul className="mb-8 flex flex-col gap-2">
        {rows.map((workspace) => (
          <li key={workspace.id}>
            <Link href={`/board/${workspace.id}`} className="block rounded border border-zinc-300 bg-white px-4 py-3 hover:bg-zinc-100">
              {workspace.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function BoardPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">タスクボード</h1>
        <form action={logout}>
          <button className="rounded border border-zinc-300 px-3 py-1 text-sm">ログアウト</button>
        </form>
      </div>
      <Suspense fallback={<p className="text-sm text-zinc-600">読み込んでいます…</p>}>
        <WorkspaceList />
      </Suspense>
      <form action={createWorkspace} className="flex gap-2">
        <input name="name" required placeholder="新しいワークスペースの名前" className="flex-1 rounded border border-zinc-300 bg-white px-3 py-2" />
        <button className="rounded bg-zinc-900 px-4 py-2 font-bold text-white">作成</button>
      </form>
    </main>
  );
}
