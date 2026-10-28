# 第1章の終わり　Supabase をローカル環境で起動する

本の第1章を終えた時点の taskboard です。本のコードの枠の上の「サンプルコード　ch01/…」は、このフォルダーのファイルを指します。

- ローカルで Supabase が起動し、Studio と Mailpit を開ける
- create-next-app で作った taskboard のひな形がある（まだ Supabase にはつないでいない）

## 実行手順

Docker Desktop を起動しておきます。Node.js 22 以上も必要です（入れ方は本の第1章）。このフォルダーをダウンロードするには、[リポジトリのトップ](../README.md)で［Code］→［Download ZIP］を押します。

`ch01` フォルダーでターミナル（Windows は PowerShell）を開き、順に実行します。

1. パッケージをインストールします。

   ```text
   npm ci
   ```

2. Supabase を起動します。「Started supabase local development setup.」と URL の表が出たら、起動しています。初めてのときは数分かかります。

   ```text
   npx supabase start
   ```

3. 開発サーバーを起動します。起動している間、このターミナルは使えません。

   ```text
   npm run dev
   ```

## 動作確認

- http://localhost:3000 … Next.js の初期画面（create-next-app が作ったままの画面）
- http://127.0.0.1:54323 … Studio（データベースの管理画面）
- http://127.0.0.1:54324 … Mailpit（ローカルの Supabase が送ったメールを見る画面）

## 停止・別の章への切り替え

- 開発サーバーは、起動しているターミナルで Ctrl＋C を押して停止します（Mac も同じキー）
- 別の章のフォルダーに移る前に、このフォルダーで `npx supabase stop` を実行して Supabase を停止します

動作しないときは、本の第1章の「うまくいかないとき」と付録C を見てください。

<details>
<summary>このフォルダーのファイル</summary>

本の第1章のコマンドが作ったファイルです。`supabase/config.toml` は `npx supabase init`、ほかは `npx create-next-app` が作りました。

</details>

[一覧](../README.md)　｜　[ch02](../ch02) →
