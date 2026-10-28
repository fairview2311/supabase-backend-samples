# Supabaseバックエンド入門 サンプルコード

書籍『Supabaseバックエンド入門 Next.js・Drizzleで学ぶユーザー認証とデータベース設計』（早瀬 透）のサンプルコードです。

本では、チームで使うタスクボード「taskboard」を1冊を通して育てます。このリポジトリには、**各章を終えた時点の taskboard** が、章ごとのフォルダー（`ch01`〜`ch10`）に入っています。本文のコードの枠と、その章のフォルダーのファイルは同じ内容です。

- 書いたコードが動かないとき、本のとおりのファイルと比較する
- 本のコードを打つ代わりに、ここからコピーして貼り付ける
- 途中の章から読み始めるとき、前の章の終わりの状態をそろえる

といった使い方をしてください。

## 本

- Kindle 版: https://www.amazon.co.jp/dp/B0HFD3RP8Y
- ペーパーバック: https://www.amazon.co.jp/dp/B0HPC2K63R

## 動かすのに必要なもの

- Docker Desktop（起動しておく）
- Node.js 22 以上

インストールの手順は本の第1章にあります。

### docker compose のファイルは必要ありません

Supabase のローカル環境（Postgres・認証・Storage・Studio・Mailpit など）は、Supabase CLI が Docker のコンテナとして起動します。`npx supabase start` を実行すると、Supabase CLI が `supabase/config.toml` の設定を読み、必要なイメージをダウンロードしてコンテナをまとめて起動します。停止は `npx supabase stop` です。そのため、このリポジトリには `docker-compose.yml` を置いていません。Docker のコマンドを自分で打つ必要もありません。

Docker Desktop が必要なのは、Supabase CLI がコンテナを動かすためです。公式ドキュメントでも、`supabase start` の前提として Docker の API に対応したコンテナの実行環境が挙げられています。

- [Local Development & CLI](https://supabase.com/docs/guides/local-development)（Supabase 公式。`supabase start` の前提に Docker が必要なこと）
- [Supabase CLI の始め方](https://supabase.com/docs/guides/local-development/cli/getting-started)（Supabase 公式。Supabase の全体が Docker のコンテナで動くこと、初回はイメージのダウンロードに時間がかかること）

## 本のコードとファイルの対応

本のコードの枠の上には、次のような行があります。

```text
サンプルコード　ch02/src/lib/supabase/client.ts
```

この行は、そのコードの枠が、このリポジトリの `ch02` フォルダーの `src/lib/supabase/client.ts` と同じ内容であることを示します。「（一部）」と付いた枠は、ファイルの一部だけを見せています。前後の行は、フォルダーのファイルで確かめてください。

`[workspaceId]` のような角かっこも、フォルダーの名前の一部です。

## ファイルを入手する方法

| やりたいこと | 方法 |
|---|---|
| 1つのファイルを比較したい・コピーしたい | 下の表で章のフォルダー（`ch02` など）を押し、ファイル名を押して開きます。中身の右上の、四角が2つ重なったボタン（マウスを乗せると「Copy raw file」と出ます）でコピーできます |
| 章のフォルダーをローカルで実行したい | このページの上の緑の［Code］を押し、［Download ZIP］を押します。展開すると `supabase-backend-samples-main` フォルダーができ、その中に `ch01`〜`ch10` があります |

## 章ごとのフォルダー

**実行手順は、各フォルダーを開くと下に表示されます。** そのフォルダーに必要な手順だけを、順に書いてあります。

| 章 | この章の終わりの taskboard | フォルダー |
|---|---|---|
| 第1章　Supabase をローカル環境で起動する | ローカルで Supabase が起動し、Next.js のひな形がある | [ch01](ch01) |
| 第2章　Next.js 16 のアプリを作って Supabase に接続する | 「Supabase に接続しました」と出る | [ch02](ch02) |
| 第3章　ユーザー登録とログインを作る | 新規登録・ログイン・ログアウト・パスワードの再設定ができる | [ch03](ch03) |
| 第4章　ワークスペース・メンバー・タスクのテーブルを設計する | Drizzle で作った3つのテーブルがある | [ch04](ch04) |
| 第5章　タスクボードの画面を作る | タスクを3列の間で移動できる（まだ RLS が無い） | [ch05](ch05) |
| 第6章　RLS で「チームのメンバーだけ」を守る | メンバーだけがボードを見られる | [ch06](ch06) |
| 第7章　仲間を招待する | 招待のメールから参加できる | [ch07](ch07) |
| 第8章　仲間の操作をリアルタイムで画面に反映する | 仲間の操作がその場で画面に出る | [ch08](ch08) |
| 第9章　タスクにファイルを添付する | タスクにファイルを添付できる | [ch09](ch09) |
| 第10章　インターネットに公開してチームで使う | 第9章と同じコード（公開の手順は本の第10章） | [ch10](ch10) |

途中の章から読み始めるときは、1つ前の章のフォルダーを使います。第6章から読むなら `ch05` です。そのフォルダーの README のとおりに起動すれば、そのまま本の続きから進められます。

## 実行手順の概要

どの章も、そのフォルダーでターミナル（Windows は PowerShell）を開いて実行します。

| 手順 | 必要な章 |
|---|---|
| `npm ci` | すべて |
| `env.local.example` を `.env.local` にコピー（Mac は `cp`、Windows は `copy`） | ch02〜 |
| `npx supabase start` | すべて |
| `npx supabase db reset`（その章までのテーブルを作る） | ch04〜 |
| `npm run dev` → http://localhost:3000 | すべて |
| test@example.com（password5678）と test2@example.com（password1234）を新規登録 | ch03〜 |

- Studio（データベースの管理画面）は http://127.0.0.1:54323 、Mailpit（届いたメールを見る画面）は http://127.0.0.1:54324 です
- `npx supabase db reset` を実行すると、登録したユーザーとデータは消えます。本で作っている自分の taskboard とローカルのデータベースは共通なので、そちらのデータも消えます
- 別の章のフォルダーに移る前には、元のフォルダーで `npx supabase stop` を実行します

## 自分のファイルと比較するとき

次のファイルは、本のとおりに進めても、このリポジトリと違っていて問題ありません。

- `supabase/migrations/` のファイル名の日時（中の SQL を比べます）と、`supabase/migrations/meta/` の中
- `package-lock.json`
- `.env.local`（このリポジトリには、ローカルの Supabase 用の値を書いた `env.local.example` を置いています）

動作しないときは、本の各章の「うまくいかないとき」と、付録C の一覧も見てください。

## 知っておくこと

- `env.local.example` の値は、ローカルの Supabase の決まった値で、誰のパソコンでも同じです。秘密の値ではありません
- 本の内容の誤りや、動作しなかったところは、このリポジトリの Issues で教えていただけると助かります
