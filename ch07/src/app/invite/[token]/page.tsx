import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { acceptInvitation } from "./actions";

async function Invite({ params, searchParams }: PageProps<"/invite/[token]">) {
  const user = await requireUser();
  const { token } = await params;
  const { error } = await searchParams;

  return (
    <>
      <p className="mb-4 text-sm text-zinc-600">{user.email} でログインしています</p>
      {error && (
        <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          招待が見つからないか、宛先が違います。招待されたメールアドレスでログインしているかを確かめてください。
        </p>
      )}
      <form action={acceptInvitation.bind(null, token)}>
        <button className="rounded bg-zinc-900 px-4 py-2 font-bold text-white">招待を承諾</button>
      </form>
    </>
  );
}

export default function InvitePage(props: PageProps<"/invite/[token]">) {
  return (
    <main className="mx-auto w-full max-w-sm px-6 py-16">
      <h1 className="mb-6 text-2xl font-bold">ワークスペースへの招待</h1>
      <Suspense fallback={<p className="text-sm text-zinc-600">読み込んでいます…</p>}>
        <Invite {...props} />
      </Suspense>
    </main>
  );
}
