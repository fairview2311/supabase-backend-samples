import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

async function ConnectionStatus() {
  const supabase = await createClient();
  const { error } = await supabase.storage.listBuckets();

  if (error) {
    return <p className="text-red-700">Supabase に接続できません: {error.message}</p>;
  }
  return <p className="text-green-700">Supabase に接続しました</p>;
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="mb-4 text-2xl font-bold">タスクボード</h1>
      <Suspense fallback={<p>確認しています…</p>}>
        <ConnectionStatus />
      </Suspense>
    </main>
  );
}
