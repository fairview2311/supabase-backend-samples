// 添付ファイルを、メンバーだけが開けて、アップロードできるかを確かめる
// 実行: npx tsx --env-file=.env.local scripts/check-storage.mts
import { createClient } from "@supabase/supabase-js";

async function login(email: string, password: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`${email} でログインできません: ${error.message}`);
  return supabase;
}

function check(label: string, ok: boolean, detail: string) {
  console.log(`${ok ? "✓" : "✘"} ${label}（${detail}）`);
  if (!ok) process.exitCode = 1;
}

const owner = await login("test@example.com", "password5678");
const other = await login("test2@example.com", "password1234");

// test のチームの添付ファイルを1つ選ぶ
const { data: file } = await owner.from("attachments").select("workspace_id, task_id, path").limit(1).single();
if (!file) throw new Error("test のチームに添付ファイルがありません。先にボードで1つ添付してください");

const mine = await owner.storage.from("attachments").createSignedUrl(file.path, 60);
check("test は添付ファイルを開く URL を作成できる", mine.error === null, mine.error?.message ?? "作成できた");

const theirs = await other.storage.from("attachments").createSignedUrl(file.path, 60);
check("test2 は test のチームの添付ファイルを開けない", theirs.error !== null, theirs.error?.message ?? "作成できた");

const put = await other.storage
  .from("attachments")
  .upload(`${file.workspace_id}/${file.task_id}/check.txt`, new Blob(["test2"]), { contentType: "text/plain" });
check("test2 は test のチームのフォルダーにファイルをアップロードできない", put.error !== null, put.error?.message ?? "アップロードできた");
