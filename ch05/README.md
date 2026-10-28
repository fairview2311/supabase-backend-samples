# 第5章の終わり　タスクボードの画面を作る

本の第5章を終えた時点の taskboard です。本のコードの枠の上の「サンプルコード　ch05/…」は、このフォルダーのファイルを指します。

- ワークスペースを作成し、タスクを追加して、未着手・進行中・完了の3列の間で移動できる
- タスクの担当者を決めたり、タスクを削除したりできる
- まだ RLS が無いので、別のチームのタスクも見えてしまう（第6章で直す）

## 実行手順

Docker Desktop を起動しておきます。Node.js 22 以上も必要です（入れ方は本の第1章）。このフォルダーをダウンロードするには、[リポジトリのトップ](../README.md)で［Code］→［Download ZIP］を押します。

`ch05` フォルダーでターミナル（Windows は PowerShell）を開き、順に実行します。

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

4. 第5章までのテーブルを作ります。ローカルのデータベースが初期化され、登録したユーザーも削除されます。本で作っている自分の taskboard とローカルのデータベースは共通なので、そちらのユーザーとデータも削除されます。

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

- test@example.com でログインし、http://localhost:3000/board でワークスペースの名前を入れて［作成］を押す
- ワークスペースのページで［追加］からタスクを追加し、［進行中 →］などで列を動かす
- test2@example.com でログインし直すと、test のワークスペースも見える（RLS がまだ無いため。第6章で直す）

## 停止・別の章への切り替え

- 開発サーバーは、起動しているターミナルで Ctrl＋C を押して停止します（Mac も同じキー）
- 別の章のフォルダーに移る前に、このフォルダーで `npx supabase stop` を実行して Supabase を停止します

動作しないときは、本の第5章の「うまくいかないとき」と付録C を見てください。

<details>
<summary>第4章からの変更（追加・変更したファイル 7 個）</summary>

- 追加: [`src/app/board/[workspaceId]/actions.ts`](src/app/board/%5BworkspaceId%5D/actions.ts)
- 追加: [`src/app/board/[workspaceId]/page.tsx`](src/app/board/%5BworkspaceId%5D/page.tsx)
- 追加: [`src/app/board/actions.ts`](src/app/board/actions.ts)
- 追加: [`src/lib/auth.ts`](src/lib/auth.ts)
- 追加: [`src/lib/db/index.ts`](src/lib/db/index.ts)
- 変更: [`env.local.example`](env.local.example)
- 変更: [`src/app/board/page.tsx`](src/app/board/page.tsx)

</details>

← [ch04](../ch04)　｜　[一覧](../README.md)　｜　[ch06](../ch06) →
