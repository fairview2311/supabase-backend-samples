"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// このワークスペースのタスクが変更されたら、画面を再読み込みする
export function RealtimeRefresh({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    const channel = supabase
      .channel(`tasks:${workspaceId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks", filter: `workspace_id=eq.${workspaceId}` },
        () => router.refresh(),
      )
      // 削除は絞り込めないので、どのタスクが削除されても読み直す
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "tasks" }, () =>
        router.refresh(),
      );

    // ログインした人のトークンを Realtime に渡してから購読する
    supabase.realtime.setAuth().then(() => {
      if (active) {
        channel.subscribe();
      }
    });

    // ページを離れたら、購読を解除する
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [workspaceId, router]);

  return null;
}
