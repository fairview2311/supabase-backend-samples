# 第3章の終わり　ユーザー登録とログインを作る

本の第3章を終えた時点の taskboard です。本のコードの枠の上の「サンプルコード　ch03/…」は、このフォルダーのファイルを指します。

- メールアドレスとパスワードで新規登録・ログイン・ログアウトができる
- ログインしていないと /board を開けない
- パスワードを忘れたときの再設定のメールが、Mailpit に日本語で届く

## 実行手順

Docker Desktop を起動しておきます。Node.js 22 以上も必要です（入れ方は本の第1章）。このフォルダーをダウンロードするには、[リポジトリのトップ](../README.md)で［Code］→［Download ZIP］を押します。

`ch03` フォルダーでターミナル（Windows は PowerShell）を開き、順に実行します。

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

5. ブラウザで http://localhost:3000/login を開き、次の2人を［新規登録］で登録します。1人目を登録したら、右上の［ログアウト］を押してから2人目を登録します。ローカルの Supabase は、メールの確認なしで登録できます。
   - test@example.com（パスワード password5678）
   - test2@example.com（パスワード password1234）

## 動作確認

- 登録した人でログインすると、http://localhost:3000/board に移る
- ［ログアウト］を押してから http://localhost:3000/board を開くと、ログインの画面に戻される
- ログインの画面からパスワードの再設定を頼むと、Mailpit（http://127.0.0.1:54324 ）にメールが届く

## 停止・別の章への切り替え

- 開発サーバーは、起動しているターミナルで Ctrl＋C を押して停止します（Mac も同じキー）
- 別の章のフォルダーに移る前に、このフォルダーで `npx supabase stop` を実行して Supabase を停止します

動作しないときは、本の第3章の「うまくいかないとき」と付録C を見てください。

<details>
<summary>第2章からの変更（追加・変更したファイル 11 個）</summary>

- 追加: [`src/app/auth/confirm/route.ts`](src/app/auth/confirm/route.ts)
- 追加: [`src/app/board/page.tsx`](src/app/board/page.tsx)
- 追加: [`src/app/forgot-password/actions.ts`](src/app/forgot-password/actions.ts)
- 追加: [`src/app/forgot-password/page.tsx`](src/app/forgot-password/page.tsx)
- 追加: [`src/app/login/actions.ts`](src/app/login/actions.ts)
- 追加: [`src/app/login/page.tsx`](src/app/login/page.tsx)
- 追加: [`src/app/update-password/actions.ts`](src/app/update-password/actions.ts)
- 追加: [`src/app/update-password/page.tsx`](src/app/update-password/page.tsx)
- 追加: [`supabase/templates/recovery.html`](supabase/templates/recovery.html)
- 変更: [`src/lib/supabase/proxy.ts`](src/lib/supabase/proxy.ts)
- 変更: [`supabase/config.toml`](supabase/config.toml)

</details>

← [ch02](../ch02)　｜　[一覧](../README.md)　｜　[ch04](../ch04) →
