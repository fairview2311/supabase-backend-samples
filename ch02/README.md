# 第2章の終わり　Next.js 16 のアプリを作って Supabase に接続する

本の第2章を終えた時点の taskboard です。本のコードの枠の上の「サンプルコード　ch02/…」は、このフォルダーのファイルを指します。

- トップページに「Supabase に接続しました」と出る
- ブラウザ用・サーバー用の Supabase のクライアントと、ログインの状態を整える proxy.ts がある

## 実行手順

Docker Desktop を起動しておきます。Node.js 22 以上も必要です（入れ方は本の第1章）。このフォルダーをダウンロードするには、[リポジトリのトップ](../README.md)で［Code］→［Download ZIP］を押します。

`ch02` フォルダーでターミナル（Windows は PowerShell）を開き、順に実行します。

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

4. 開発サーバーを起動します。起動している間、このターミナルは使えません。

   ```text
   npm run dev
   ```

## 動作確認

- http://localhost:3000 に、緑の文字で「Supabase に接続しました」と出る

## 停止・別の章への切り替え

- 開発サーバーは、起動しているターミナルで Ctrl＋C を押して停止します（Mac も同じキー）
- 別の章のフォルダーに移る前に、このフォルダーで `npx supabase stop` を実行して Supabase を停止します

動作しないときは、本の第2章の「うまくいかないとき」と付録C を見てください。

<details>
<summary>第1章からの変更（追加・変更したファイル 9 個）</summary>

- 追加: [`env.local.example`](env.local.example)
- 追加: [`src/lib/supabase/client.ts`](src/lib/supabase/client.ts)
- 追加: [`src/lib/supabase/proxy.ts`](src/lib/supabase/proxy.ts)
- 追加: [`src/lib/supabase/server.ts`](src/lib/supabase/server.ts)
- 追加: [`src/proxy.ts`](src/proxy.ts)
- 変更: [`package.json`](package.json)
- 変更: [`src/app/globals.css`](src/app/globals.css)
- 変更: [`src/app/layout.tsx`](src/app/layout.tsx)
- 変更: [`src/app/page.tsx`](src/app/page.tsx)

</details>

← [ch01](../ch01)　｜　[一覧](../README.md)　｜　[ch03](../ch03) →
