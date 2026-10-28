import { Suspense } from "react";
import { sendResetMail } from "./actions";

async function SentMessage({ searchParams }: { searchParams: PageProps<"/forgot-password">["searchParams"] }) {
  const { sent } = await searchParams;
  if (sent !== "1") return null;
  return <p className="rounded bg-green-50 px-3 py-2 text-sm text-green-800">再設定のメールを送りました。メールのリンクを開いてください。</p>;
}

export default function ForgotPasswordPage({ searchParams }: PageProps<"/forgot-password">) {
  return (
    <main className="mx-auto w-full max-w-sm px-6 py-16">
      <h1 className="mb-6 text-2xl font-bold">パスワードの再設定</h1>
      <form action={sendResetMail} className="flex flex-col gap-4">
        <Suspense>
          <SentMessage searchParams={searchParams} />
        </Suspense>
        <label className="flex flex-col gap-1 text-sm">
          登録したメールアドレス
          <input name="email" type="email" required className="rounded border border-zinc-300 bg-white px-3 py-2" />
        </label>
        <button className="rounded bg-zinc-900 px-4 py-2 font-bold text-white">再設定メールを送信</button>
      </form>
    </main>
  );
}
