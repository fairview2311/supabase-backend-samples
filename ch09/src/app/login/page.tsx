import Link from "next/link";
import { Suspense } from "react";
import { login, signup } from "./actions";

async function Message({ searchParams }: { searchParams: PageProps<"/login">["searchParams"] }) {
  const { message } = await searchParams;
  if (typeof message !== "string") return null;
  return <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>;
}

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="mx-auto w-full max-w-sm px-6 py-16">
      <h1 className="mb-6 text-2xl font-bold">ログイン</h1>
      <form className="flex flex-col gap-4">
        <Suspense>
          <Message searchParams={searchParams} />
        </Suspense>
        <label className="flex flex-col gap-1 text-sm">
          メールアドレス
          <input name="email" type="email" required className="rounded border border-zinc-300 bg-white px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          パスワード（6文字以上）
          <input name="password" type="password" required minLength={6} className="rounded border border-zinc-300 bg-white px-3 py-2" />
        </label>
        <button formAction={login} className="rounded bg-zinc-900 px-4 py-2 font-bold text-white">
          ログイン
        </button>
        <button formAction={signup} className="rounded border border-zinc-900 px-4 py-2 font-bold">
          新規登録
        </button>
      </form>
      <Link href="/forgot-password" className="mt-6 block text-sm text-blue-700 underline">
        パスワードを忘れた場合
      </Link>
    </main>
  );
}
