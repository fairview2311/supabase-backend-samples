// タスクの変更が、メンバーにだけ届くかを確かめる
// 実行: npx tsx --env-file=.env.local scripts/check-realtime.mts
import { createClient } from "@supabase/supabase-js";

// メールとパスワードでログインし、Realtime にもトークンを渡す
async function login(email: string, password: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`${email} でログインできません: ${error.message}`);
  await supabase.realtime.setAuth();
  return supabase;
}

const owner = await login("test@example.com", "password5678");
const other = await login("test2@example.com", "password1234");

// 2人とも、絞り込まずに tasks のすべての変更を購読する
const received = { test: 0, test2: 0 };
for (const [name, supabase] of [["test", owner], ["test2", other]] as const) {
  await new Promise<void>((resolve) => {
    supabase
      .channel(`check-${name}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "tasks" }, () => {
        received[name] += 1;
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") resolve();
      });
  });
}
// 購読の準備ができるまで、少し待つ
await new Promise((resolve) => setTimeout(resolve, 5000));

// test が、自分のチームのタスクを1つ選んで、同じ列のまま更新する
const { data: task } = await owner.from("tasks").select("id, status").limit(1).single();
if (!task) throw new Error("test のチームにタスクがありません。先に1つ追加してください");
await owner.from("tasks").update({ status: task.status }).eq("id", task.id);
await new Promise((resolve) => setTimeout(resolve, 3000));

console.log(`${received.test > 0 ? "✓" : "✘"} メンバーの test には届く（${received.test}件）`);
console.log(`${received.test2 === 0 ? "✓" : "✘"} 別のチームの test2 には届かない（${received.test2}件）`);
if (received.test === 0 || received.test2 > 0) process.exitCode = 1;
process.exit();
