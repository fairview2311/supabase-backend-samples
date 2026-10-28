import { updatePassword } from "./actions";

export default function UpdatePasswordPage() {
  return (
    <main className="mx-auto w-full max-w-sm px-6 py-16">
      <h1 className="mb-6 text-2xl font-bold">新しいパスワード</h1>
      <form action={updatePassword} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          新しいパスワード（6文字以上）
          <input name="password" type="password" required minLength={6} className="rounded border border-zinc-300 bg-white px-3 py-2" />
        </label>
        <button className="rounded bg-zinc-900 px-4 py-2 font-bold text-white">パスワードを変更</button>
      </form>
    </main>
  );
}
