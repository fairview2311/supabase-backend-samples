// 2人のユーザーで、RLS が効いているかを確かめる
// 実行: npx tsx --env-file=.env.local scripts/check-rls.mts
import { createClient } from "@supabase/supabase-js";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { invitations, tasks, workspaceMembers, workspaces } from "../src/db/schema";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle({ client });
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

// メールとパスワードでログインし、トークンの中身（claims）を返す
async function login(email: string, password: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`${email} でログインできません: ${error.message}`);
  const { data } = await supabase.auth.getClaims();
  return data!.claims;
}

// src/lib/db/with-user.ts と同じ形で、その人としてクエリを実行する
function as<T>(claims: { sub: string }, fn: (tx: Tx) => Promise<T>) {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('request.jwt.claims', ${JSON.stringify(claims)}, true)`);
    await tx.execute(sql`set local role authenticated`);
    return fn(tx);
  });
}

function check(label: string, ok: boolean, detail: string) {
  console.log(`${ok ? "✓" : "✘"} ${label}（${detail}）`);
  if (!ok) process.exitCode = 1;
}

const owner = await login("test@example.com", "password5678");
const other = await login("test2@example.com", "password1234");

const [workspace] = await as(owner, (tx) => tx.select().from(workspaces).limit(1));
check("test は自分のワークスペースを読み取れる", workspace !== undefined, workspace?.name ?? "0件");

const seen = await as(other, (tx) => tx.select().from(workspaces));
const leaked = seen.filter((w) => w.id === workspace.id);
check("test2 には test のワークスペースが見えない", leaked.length === 0, `test2 に見えたのは ${seen.length}件`);

const seenTasks = await as(other, (tx) => tx.select().from(tasks).where(eq(tasks.workspaceId, workspace.id)));
check("test2 には test のタスクが見えない", seenTasks.length === 0, `${seenTasks.length}件`);

const joined = await as(other, (tx) =>
  tx.insert(workspaceMembers).values({ workspaceId: workspace.id, userId: other.sub, email: "test2@example.com" }),
).then(() => "追加できた", (e) => e.cause?.message ?? e.message);
check("test2 は自分をメンバーに追加できない", joined !== "追加できた", joined);

const removed = await as(other, (tx) => tx.delete(workspaces).where(eq(workspaces.id, workspace.id)).returning());
check("test2 は test のワークスペースを削除できない", removed.length === 0, `${removed.length}件を削除した`);

const invited = await as(other, (tx) =>
  tx.insert(invitations).values({ workspaceId: workspace.id, email: "test2@example.com", invitedBy: other.sub }),
).then(() => "作成できた", (e) => e.cause?.message ?? e.message);
check("test2 は test のワークスペースへの招待を作成できない", invited !== "作成できた", invited);

const [invitation] = await as(owner, (tx) =>
  tx
    .insert(invitations)
    .values({ workspaceId: workspace.id, email: "test4@example.com", invitedBy: owner.sub })
    .returning(),
);
const accepted = await as(other, (tx) => tx.execute(sql`select public.accept_invitation(${invitation.token})`)).then(
  () => "承諾できた",
  (e) => e.cause?.message ?? e.message,
);
check("test2 は test4 あての招待を承諾できない", accepted !== "承諾できた", accepted);
await as(owner, (tx) => tx.delete(invitations).where(eq(invitations.id, invitation.id)));

const all = await db.select().from(tasks);
console.log(`（参考）postgres のまま接続すると、タスクが ${all.length} 件見える`);

await client.end();
