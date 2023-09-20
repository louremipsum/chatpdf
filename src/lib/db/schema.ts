import {
  timestamp,
  pgTable,
  serial,
  text,
  varchar,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userSystemEnum = pgEnum("user_system_enum", ["system", "user"]);

/* The code is defining a table called "chats" using the `pgTable` function from the
"drizzle-orm/pg-core" library. The table has the following columns: */
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  pdfName: text("pdf_name").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  fileKey: text("file_key").notNull(),
});

/* The code is defining a table called "messages" using the `pgTable` function from the
"drizzle-orm/pg-core" library. The table has the following columns: */
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id")
    .references(() => chats.id)
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  role: userSystemEnum("role").notNull(),
});
