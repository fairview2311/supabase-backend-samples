import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data) {
    redirect("/login");
  }
  return { id: data.claims.sub, email: String(data.claims.email) };
}
