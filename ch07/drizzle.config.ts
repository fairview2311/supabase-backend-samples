import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./supabase/migrations",
  schemaFilter: ["public"],
  entities: { roles: { provider: "supabase" } },
  migrations: { prefix: "supabase" },
});
