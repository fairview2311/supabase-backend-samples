# 第10章の終わり　インターネットに公開してチームで使う

本の第10章を終えた時点の taskboard です。本のコードの枠の上の「サンプルコード　ch10/…」は、このフォルダーのファイルを指します。

- コードは第9章（[ch09](../ch09)）と同じです。第10章で変えるのはコードではなく、Supabase と Vercel の設定（環境変数・URL）です
- インターネットへの公開の手順は、本の第10章にあります。ここでは、公開する前にローカルで実行する手順を書きます

## 実行手順

Docker Desktop を起動しておきます。Node.js 22 以上も必要です（入れ方は本の第1章）。このフォルダーをダウンロードするには、[リポジトリのトップ](../README.md)で［Code］→［Download ZIP］を押します。

`ch10` フォルダーでターミナル（Windows は PowerShell）を開き、順に実行します。

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

4. 第10章までのテーブルを作ります。ローカルのデータベースが初期化され、登録したユーザーも削除されます。本で作っている自分の taskboard とローカルのデータベースは共通なので、そちらのユーザーとデータも削除されます。

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

- 第9章と同じです。test@example.com でログインしてワークスペースとタスクを作り、タスクのカードの［添付］から、ファイルを添付できます。動作確認の方法は [ch09 の README](../ch09) と同じです

## 停止・別の章への切り替え

- 開発サーバーは、起動しているターミナルで Ctrl＋C を押して停止します（Mac も同じキー）
- 別の章のフォルダーに移る前に、このフォルダーで `npx supabase stop` を実行して Supabase を停止します

動作しないときは、本の第10章の「うまくいかないとき」と付録C を見てください。

第9章から変更したファイルはありません。

← [ch09](../ch09)　｜　[一覧](../README.md)
