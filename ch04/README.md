# 第4章の終わり　ワークスペース・メンバー・タスクのテーブルを設計する

本の第4章を終えた時点の taskboard です。本のコードの枠の上の「サンプルコード　ch04/…」は、このフォルダーのファイルを指します。

- ワークスペース・メンバー・タスクの3つのテーブルが、Drizzle のスキーマとマイグレーションでできている
- ワークスペースを作ると、作った人が持ち主としてメンバーに入る（トリガー）

## 実行手順

Docker Desktop を起動しておきます。Node.js 22 以上も必要です（入れ方は本の第1章）。このフォルダーをダウンロードするには、[リポジトリのトップ](../README.md)で［Code］→［Download ZIP］を押します。

`ch04` フォルダーでターミナル（Windows は PowerShell）を開き、順に実行します。

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

4. 第4章までのテーブルを作ります。ローカルのデータベースが初期化され、登録したユーザーも削除されます。本で作っている自分の taskboard とローカルのデータベースは共通なので、そちらのユーザーとデータも削除されます。

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

- Studio（http://127.0.0.1:54323 ）の Table Editor に、workspaces・workspace_members・tasks の3つのテーブルが出る

## 停止・別の章への切り替え

- 開発サーバーは、起動しているターミナルで Ctrl＋C を押して停止します（Mac も同じキー）
- 別の章のフォルダーに移る前に、このフォルダーで `npx supabase stop` を実行して Supabase を停止します

動作しないときは、本の第4章の「うまくいかないとき」と付録C を見てください。

<details>
<summary>第3章からの変更（追加・変更したファイル 5 個）</summary>

- 追加: [`drizzle.config.ts`](drizzle.config.ts)
- 追加: [`src/db/schema.ts`](src/db/schema.ts)
- 追加: [`supabase/migrations/20261026032751_tables.sql`](supabase/migrations/20261026032751_tables.sql)（マイグレーション）
- 追加: [`supabase/migrations/20261026032753_owner_trigger.sql`](supabase/migrations/20261026032753_owner_trigger.sql)（マイグレーション）
- 変更: [`package.json`](package.json)

マイグレーションのファイル名の日時は、自分で作ったものと違っていて問題ありません。中の SQL を比べます。

</details>

← [ch03](../ch03)　｜　[一覧](../README.md)　｜　[ch05](../ch05) →
