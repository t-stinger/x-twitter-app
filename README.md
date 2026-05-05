# X Clone - Simple Twitter-like App

シンプルなX(旧Twitter)風投稿アプリです。

## 機能

- **ユーザー認証** - メール・パスワードでのシンプルなログイン/サインアップ
- **つぶやき投稿** - テキスト + 画像対応の投稿機能
- **タイムライン** - 投稿の一覧表示（新しい順）
- **投稿削除** - 自分の投稿の削除機能

## 技術スタック

- **フロントエンド**: React 19 + Vite + React Router
- **バックエンド**: Supabase (PostgreSQL, Auth, Storage)
- **デプロイ**: GitHub Pages + GitHub Actions

## セットアップ

### 1. Supabase プロジェクト作成

[Supabase](https://supabase.com) でプロジェクトを作成し、以下の SQL を実行します：

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tweets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE tweets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all tweets"
  ON tweets FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own tweets"
  ON tweets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tweets"
  ON tweets FOR DELETE
  USING (auth.uid() = user_id);
```

また、Storage に `tweets-images` バケットを作成し、公開設定にします。

### 2. 環境変数を設定

`.env.local` ファイルに Supabase の情報を入力します：

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 開発サーバーを起動

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスします。

## GitHub Pages へのデプロイ

### 1. GitHub リポジトリを作成・プッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/x-twitter-app.git
git push -u origin main
```

### 2. GitHub Pages を有効化

リポジトリの Settings → Pages で、Source を "Deploy from a branch" に設定し、ブランチを "gh-pages" に設定します。

### 3. リポジトリ名が異なる場合

`vite.config.js` の `base` を調整します：

```javascript
base: '/リポジトリ名/',
```

## 使い方

1. サインアップ - ユーザー名、メール、パスワードで新規登録
2. ログイン - 登録したメール・パスワードでログイン
3. つぶやき投稿 - テキストを入力し、オプションで画像を選択して「つぶやく」をクリック
4. 投稿削除 - 自分の投稿の「✕」をクリック
5. ログアウト - ヘッダーのログアウトボタンをクリック
