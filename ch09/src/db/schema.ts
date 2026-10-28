import { sql } from "drizzle-orm";
import { pgEnum, pgPolicy, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { authenticatedRole, authUsers } from "drizzle-orm/supabase";

export const memberRole = pgEnum("member_role", ["owner", "member"]);
export const taskStatus = pgEnum("task_status", ["todo", "doing", "done"]);

const isMember = (workspaceId: unknown) => sql`public.is_workspace_member(${workspaceId})`;
const isOwner = (workspaceId: unknown) => sql`public.is_workspace_owner(${workspaceId})`;

export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    pgPolicy("メンバーが読み取れる", {
      for: "select",
      to: authenticatedRole,
      using: sql`${isMember(t.id)} or (select auth.uid()) = ${t.createdBy}`,
    }),
    pgPolicy("ログインした人が作成できる", { for: "insert", to: authenticatedRole, withCheck: sql`(select auth.uid()) = ${t.createdBy}` }),
    pgPolicy("持ち主が名前を変更できる", { for: "update", to: authenticatedRole, using: isOwner(t.id) }),
    pgPolicy("持ち主が削除できる", { for: "delete", to: authenticatedRole, using: isOwner(t.id) }),
  ],
).enableRLS();

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: memberRole("role").notNull().default("member"),
  },
  (t) => [
    primaryKey({ columns: [t.workspaceId, t.userId] }),
    pgPolicy("同じワークスペースの人が読み取れる", { for: "select", to: authenticatedRole, using: isMember(t.workspaceId) }),
    pgPolicy("持ち主がメンバーを追加できる", { for: "insert", to: authenticatedRole, withCheck: isOwner(t.workspaceId) }),
    pgPolicy("持ち主がメンバーを削除できる", { for: "delete", to: authenticatedRole, using: isOwner(t.workspaceId) }),
  ],
).enableRLS();

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    status: taskStatus("status").notNull().default("todo"),
    assigneeId: uuid("assignee_id").references(() => authUsers.id, { onDelete: "set null" }),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    pgPolicy("メンバーが読み取れる", { for: "select", to: authenticatedRole, using: isMember(t.workspaceId) }),
    pgPolicy("メンバーが作成できる", { for: "insert", to: authenticatedRole, withCheck: isMember(t.workspaceId) }),
    pgPolicy("メンバーが変更できる", { for: "update", to: authenticatedRole, using: isMember(t.workspaceId) }),
    pgPolicy("作成者か持ち主が削除できる", { for: "delete", to: authenticatedRole, using: sql`(select auth.uid()) = ${t.createdBy} or ${isOwner(t.workspaceId)}` }),
  ],
).enableRLS();

export const invitations = pgTable(
  "invitations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    token: uuid("token").notNull().unique().defaultRandom(),
    invitedBy: uuid("invited_by")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    pgPolicy("持ち主が招待を読み取れる", { for: "select", to: authenticatedRole, using: isOwner(t.workspaceId) }),
    pgPolicy("持ち主が招待を作成できる", { for: "insert", to: authenticatedRole, withCheck: isOwner(t.workspaceId) }),
    pgPolicy("持ち主が招待を削除できる", { for: "delete", to: authenticatedRole, using: isOwner(t.workspaceId) }),
  ],
).enableRLS();

export const attachments = pgTable(
  "attachments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    path: text("path").notNull().unique(),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    pgPolicy("メンバーが添付を読み取れる", { for: "select", to: authenticatedRole, using: isMember(t.workspaceId) }),
    pgPolicy("メンバーが添付を追加できる", { for: "insert", to: authenticatedRole, withCheck: isMember(t.workspaceId) }),
    pgPolicy("添付した人か持ち主が添付を削除できる", { for: "delete", to: authenticatedRole, using: sql`(select auth.uid()) = ${t.createdBy} or ${isOwner(t.workspaceId)}` }),
  ],
).enableRLS();
