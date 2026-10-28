import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "タスクボード",
  description: "チームで使うタスクボード",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900">
        {children}
      </body>
    </html>
  );
}
