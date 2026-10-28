import { and, asc, eq, isNull } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { invitations, tasks, workspaceMembers, workspaces } from "@/db/schema";
import { withUser } from "@/lib/db/with-user";
import { addTask, assignTask, deleteTask, inviteMember, moveTask } from "./actions";

const columns = [
  { status: "todo", label: "未着手" },
  { status: "doing", label: "進行中" },
  { status: "done", label: "完了" },
] as const;

async function Board({ params }: { params: PageProps<"/board/[workspaceId]">["params"] }) {
  const { workspaceId } = await params;

  const { workspace, members, rows, pending, user } = await withUser(async (tx, user) => {
    const [workspace] = await tx.select().from(workspaces).where(eq(workspaces.id, workspaceId));
    const members = await tx
      .select()
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, workspaceId));
    const rows = await tx
      .select()
      .from(tasks)
      .where(eq(tasks.workspaceId, workspaceId))
      .orderBy(asc(tasks.createdAt));
    const pending = await tx
      .select()
      .from(invitations)
      .where(and(eq(invitations.workspaceId, workspaceId), isNull(invitations.acceptedAt)));
    return { workspace, members, rows, pending, user };
  });
  if (!workspace) {
    notFound();
  }
  const isOwner = members.some((member) => member.userId === user.id && member.role === "owner");

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">{workspace.name}</h1>
      {isOwner && (
        <section className="mb-6 rounded border border-zinc-300 bg-white p-3">
          <h2 className="mb-2 font-bold">仲間を招待する</h2>
          <form action={inviteMember.bind(null, workspaceId)} className="mb-2 flex gap-2">
            <input name="email" type="email" required placeholder="招待する人のメールアドレス" className="flex-1 rounded border border-zinc-300 px-3 py-2" />
            <button className="rounded bg-zinc-900 px-4 py-2 font-bold text-white">招待を送信</button>
          </form>
          <ul className="text-sm text-zinc-600">
            {pending.map((invitation) => (
              <li key={invitation.id}>{invitation.email}（招待中）</li>
            ))}
          </ul>
        </section>
      )}
      <form action={addTask.bind(null, workspaceId)} className="mb-6 flex gap-2">
        <input name="title" required placeholder="新しいタスク" className="flex-1 rounded border border-zinc-300 bg-white px-3 py-2" />
        <button className="rounded bg-zinc-900 px-4 py-2 font-bold text-white">追加</button>
      </form>
      <div className="grid grid-cols-3 gap-3">
        {columns.map((column, i) => (
          <section key={column.status} className="rounded bg-zinc-200 p-3">
            <h2 className="mb-3 font-bold">{column.label}</h2>
            <ul className="flex flex-col gap-2">
              {rows
                .filter((task) => task.status === column.status)
                .map((task) => (
                  <li key={task.id} className="rounded bg-white p-3 text-sm shadow">
                    <p className="font-bold">{task.title}</p>
                    <p className="mb-2 text-xs text-zinc-600">
                      担当: {members.find((member) => member.userId === task.assigneeId)?.email ?? "なし"}
                    </p>
                    <form action={assignTask.bind(null, task.id)} className="mb-2 flex flex-col gap-1">
                      <select name="assigneeId" defaultValue={task.assigneeId ?? ""} className="rounded border border-zinc-300 text-xs">
                        <option value="">担当なし</option>
                        {members.map((member) => (
                          <option key={member.userId} value={member.userId}>
                            {member.email}
                          </option>
                        ))}
                      </select>
                      <button className="self-start rounded border border-zinc-300 px-2 text-xs whitespace-nowrap">担当者を設定</button>
                    </form>
                    <div className="flex flex-wrap gap-1">
                      {i > 0 && (
                        <form action={moveTask.bind(null, task.id, columns[i - 1].status)}>
                          <button className="rounded border border-zinc-300 px-2 text-xs whitespace-nowrap">← {columns[i - 1].label}</button>
                        </form>
                      )}
                      {i < columns.length - 1 && (
                        <form action={moveTask.bind(null, task.id, columns[i + 1].status)}>
                          <button className="rounded border border-zinc-300 px-2 text-xs whitespace-nowrap">{columns[i + 1].label} →</button>
                        </form>
                      )}
                      <form action={deleteTask.bind(null, task.id)}>
                        <button className="rounded px-2 text-xs text-red-700 whitespace-nowrap">削除</button>
                      </form>
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

export default function WorkspacePage({ params }: PageProps<"/board/[workspaceId]">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <Link href="/board" className="mb-4 block text-sm text-blue-700 underline">
        ワークスペースの一覧へ
      </Link>
      <Suspense fallback={<p className="text-sm text-zinc-600">読み込んでいます…</p>}>
        <Board params={params} />
      </Suspense>
    </main>
  );
}
