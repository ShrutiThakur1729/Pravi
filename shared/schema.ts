import { pgTable, text, serial, integer, boolean, timestamp, json, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export Replit Auth user/session tables & types (mandatory for auth integration)
export * from "./models/auth";
import { users } from "./models/auth";

// Tasks schema
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false),
  dueDate: timestamp("due_date"),
  timeOfDay: text("time_of_day"), // morning, afternoon, evening
  priority: integer("priority").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

// Learning Modules schema
export const learningModules = pgTable("learning_modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  totalSections: integer("total_sections").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLearningModuleSchema = createInsertSchema(learningModules).omit({
  id: true,
  createdAt: true,
});

// Module Sections schema
export const moduleSections = pgTable("module_sections", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull(),
  title: text("title").notNull(),
  order: integer("order").default(0),
  completed: boolean("completed").default(false),
  content: text("content"),
});

export const insertModuleSectionSchema = createInsertSchema(moduleSections).omit({
  id: true,
});

// User Progress schema
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  moduleId: integer("module_id").notNull(),
  currentSection: integer("current_section").default(0),
  percentComplete: integer("percent_complete").default(0),
  lastAccessed: timestamp("last_accessed").defaultNow(),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastAccessed: true,
});

// Emotion Tracking schema
export const emotionLogs = pgTable("emotion_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  emotion: text("emotion").notNull(),
  intensity: integer("intensity").default(5),
  notes: text("notes"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertEmotionLogSchema = createInsertSchema(emotionLogs).omit({
  id: true,
  timestamp: true,
});

// Resources schema
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  type: text("type"), // article, video, guide
  tags: text("tags").array(),
  readTime: integer("read_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

// AI Chat History schema
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  content: text("content").notNull(),
  isUser: boolean("is_user").default(true),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

// Onboarding state (per-user, tracks whether the intro tour has been completed)
export const userOnboarding = pgTable("user_onboarding", {
  userId: varchar("user_id").primaryKey().references(() => users.id),
  tourCompleted: boolean("tour_completed").default(false),
  completedAt: timestamp("completed_at"),
});

export const insertUserOnboardingSchema = createInsertSchema(userOnboarding);

// Export types
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type LearningModule = typeof learningModules.$inferSelect;
export type InsertLearningModule = z.infer<typeof insertLearningModuleSchema>;

export type ModuleSection = typeof moduleSections.$inferSelect;
export type InsertModuleSection = z.infer<typeof insertModuleSectionSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type EmotionLog = typeof emotionLogs.$inferSelect;
export type InsertEmotionLog = z.infer<typeof insertEmotionLogSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type UserOnboarding = typeof userOnboarding.$inferSelect;
export type InsertUserOnboarding = z.infer<typeof insertUserOnboardingSchema>;
