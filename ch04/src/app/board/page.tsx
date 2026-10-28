import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { logout } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";

async function CurrentUser() {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data) {
    redirect("/login");
  }
  return <p className="text-sm text-zinc-600">{data.claims.email} でログインしています</p>;
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
      <Suspense fallback={<p className="text-sm text-zinc-600">確認しています…</p>}>
        <CurrentUser />
      </Suspense>
    </main>
  );
}
