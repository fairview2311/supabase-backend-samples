# 第7章の終わり　仲間を招待する

本の第7章を終えた時点の taskboard です。本のコードの枠の上の「サンプルコード　ch07/…」は、このフォルダーのファイルを指します。

- 持ち主が仲間を招待でき、招待のメールのリンクから参加できる
- 招待のメールの宛先と違うアドレスでログインした人は、参加できない

## 実行手順

Docker Desktop を起動しておきます。Node.js 22 以上も必要です（入れ方は本の第1章）。このフォルダーをダウンロードするには、[リポジトリのトップ](../README.md)で［Code］→［Download ZIP］を押します。

`ch07` フォルダーでターミナル（Windows は PowerShell）を開き、順に実行します。

1. パッケージをインストールします。

   ```text
   npm ci
   ```

2. Supabase に接続するための `.env.local` を作ります。

   Mac:

   ```text
   cp env.local.example .env.local
   ```

   Windows（PowerShell）:

   ```text
   copy env.local.example .env.local
   ```

3. Supabase を起動します。「Started supabase local development setup.」と URL の表が出たら、起動しています。初めてのときは数分かかります。

   ```text
   npx supabase start
   ```

4. 第7章までのテーブルを作ります。ローカルのデータベースが初期化され、登録したユーザーも削除されます。本で作っている自分の taskboard とローカルのデータベースは共通なので、そちらのユーザーとデータも削除されます。

   ```text
   npx supabase db reset
   ```

5. 開発サーバーを起動します。起動している間、このターミナルは使えません。

   ```text
   npm run dev
   ```

6. ブラウザで http://localhost:3000/login を開き、次の2人を［新規登録］で登録します。1人目を登録したら、右上の［ログアウト］を押してから2人目を登録します。ローカルの Supabase は、メールの確認なしで登録できます。
   - test@example.com（パスワード password5678）
   - test2@example.com（パスワード password1234）

## 動作確認

- test@example.com でワークスペースを作り、ワークスペースのページの「仲間を招待する」にメールアドレスを入れて［招待を送信］を押す
- Mailpit（http://127.0.0.1:54324 ）に招待のメールが届き、リンクから参加できる（本のとおり、シークレットウィンドウで開く）

## テスト用のスクリプト

先に、test@example.com でログインしてワークスペースを1つ作っておきます。

`npm run dev` とは別のターミナルを `ch07` フォルダーで開き、次を実行します。

```text
npx tsx --env-file=.env.local scripts/check-rls.mts
```

すべての行が ✓ になれば、本のとおりに動作しています。（ ）の中の数は、人によって違います。結果の見方は本の第7章にあります。

## 停止・別の章への切り替え

- 開発サーバーは、起動しているターミナルで Ctrl＋C を押して停止します（Mac も同じキー）
- 別の章のフォルダーに移る前に、このフォルダーで `npx supabase stop` を実行して Supabase を停止します

動作しないときは、本の第7章の「うまくいかないとき」と付録C を見てください。

<details>
<summary>第6章からの変更（追加・変更したファイル 11 個）</summary>

- 追加: [`src/app/invite/[token]/actions.ts`](src/app/invite/%5Btoken%5D/actions.ts)
- 追加: [`src/app/invite/[token]/page.tsx`](src/app/invite/%5Btoken%5D/page.tsx)
- 追加: [`supabase/templates/magic_link.html`](supabase/templates/magic_link.html)
- 追加: [`supabase/migrations/20261026040146_invitations.sql`](supabase/migrations/20261026040146_invitations.sql)（マイグレーション）
- 追加: [`supabase/migrations/20261026040149_accept_invitation.sql`](supabase/migrations/20261026040149_accept_invitation.sql)（マイグレーション）
- 変更: [`scripts/check-rls.mts`](scripts/check-rls.mts)
- 変更: [`src/app/auth/confirm/route.ts`](src/app/auth/confirm/route.ts)
- 変更: [`src/app/board/[workspaceId]/actions.ts`](src/app/board/%5BworkspaceId%5D/actions.ts)
- 変更: [`src/app/board/[workspaceId]/page.tsx`](src/app/board/%5BworkspaceId%5D/page.tsx)
- 変更: [`src/db/schema.ts`](src/db/schema.ts)
- 変更: [`supabase/config.toml`](supabase/config.toml)

マイグレーションのファイル名の日時は、自分で作ったものと違っていて問題ありません。中の SQL を比べます。

</details>

← [ch06](../ch06)　｜　[一覧](../README.md)　｜　[ch08](../ch08) →
