import { sql } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
type User = Awaited<ReturnType<typeof requireUser>>;

// ログインした人として、データベースにクエリを実行する（RLS が効く）
export async function withUser<T>(fn: (tx: Tx, user: User) => Promise<T>): Promise<T> {
  const user = await requireUser();
  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('request.jwt.claims', ${JSON.stringify(user.claims)}, true)`);
    await tx.execute(sql`set local role authenticated`);
    return fn(tx, user);
  });
}
