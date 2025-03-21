import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User role enum
export const userRoleEnum = pgEnum('user_role', ['student', 'admin', 'superadmin']);

// School enum
export const schoolEnum = pgEnum('school', [
  'Royal College',
  'Visakha Vidyalaya',
  'Ananda College',
  'Devi Balika Vidyalaya',
  'Other'
]);

// User table schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default('student'),
  school: schoolEnum("school"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Questions table schema
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  questionText: text("question_text").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  difficulty: text("difficulty").default('medium'),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz state enum
export const quizStateEnum = pgEnum('quiz_state', ['waiting', 'started', 'completed']);

// Quiz settings table schema
export const quizSettings = pgTable("quiz_settings", {
  id: serial("id").primaryKey(),
  state: quizStateEnum("state").notNull().default('waiting'),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  lastReset: timestamp("last_reset"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quiz answers table schema
export const quizAnswers = pgTable("quiz_answers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  questionId: integer("question_id").notNull().references(() => questions.id),
  userAnswer: text("user_answer"),
  isCorrect: boolean("is_correct"),
  responseTimeSeconds: integer("response_time_seconds"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Results table schema
export const results = pgTable("results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  score: integer("score").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  incorrectAnswers: integer("incorrect_answers").notNull(),
  skippedAnswers: integer("skipped_answers").notNull(),
  averageResponseTime: integer("average_response_time"),
  completionTime: integer("completion_time"),
  rank: integer("rank"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for form validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  lastLogin: true,
  createdAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
});

export const insertQuizSettingsSchema = createInsertSchema(quizSettings).omit({
  id: true,
  startTime: true,
  endTime: true,
  lastReset: true,
  updatedAt: true,
});

export const insertQuizAnswerSchema = createInsertSchema(quizAnswers).omit({
  id: true,
  isCorrect: true,
  createdAt: true,
});

export const insertResultSchema = createInsertSchema(results).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  username: z.string().min(3, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  school: z.string().optional(),
  role: z.enum(['student', 'admin', 'superadmin']).optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type QuizSetting = typeof quizSettings.$inferSelect;
export type InsertQuizSetting = z.infer<typeof insertQuizSettingsSchema>;
export type QuizAnswer = typeof quizAnswers.$inferSelect;
export type InsertQuizAnswer = z.infer<typeof insertQuizAnswerSchema>;
export type Result = typeof results.$inferSelect;
export type InsertResult = z.infer<typeof insertResultSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
