import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const redirectTo = request.nextUrl.clone();
  redirectTo.search = "";
  const next = searchParams.get("next") ?? "/board";
  // 招待のメールの next は「http://localhost:3000/invite/…」のような URL で届くので、パスの部分だけを使う
  redirectTo.pathname = next.startsWith("http") ? new URL(next).pathname : next;

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }

  redirectTo.pathname = "/login";
  redirectTo.searchParams.set("message", "リンクが古いか、すでに使われています");
  return NextResponse.redirect(redirectTo);
}
