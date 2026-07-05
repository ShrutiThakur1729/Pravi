import {
  users, tasks, learningModules, moduleSections, userProgress, emotionLogs, resources, chatMessages,
  User, InsertUser,
  Task, InsertTask,
  LearningModule, InsertLearningModule,
  ModuleSection, InsertModuleSection,
  UserProgress, InsertUserProgress,
  EmotionLog, InsertEmotionLog,
  Resource, InsertResource,
  ChatMessage, InsertChatMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPreferences(id: number, preferences: any): Promise<User | undefined>;

  // Task methods
  getTasks(userId: number): Promise<Task[]>;
  getTaskById(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // Learning module methods
  getLearningModules(): Promise<LearningModule[]>;
  getLearningModuleById(id: number): Promise<LearningModule | undefined>;
  createLearningModule(module: InsertLearningModule): Promise<LearningModule>;

  // Module section methods
  getModuleSections(moduleId: number): Promise<ModuleSection[]>;
  createModuleSection(section: InsertModuleSection): Promise<ModuleSection>;
  updateModuleSection(id: number, section: Partial<ModuleSection>): Promise<ModuleSection | undefined>;

  // User progress methods
  getUserProgress(userId: number, moduleId: number): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, moduleId: number, progress: Partial<UserProgress>): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;

  // Emotion tracking methods
  getEmotionLogs(userId: number, limit?: number): Promise<EmotionLog[]>;
  createEmotionLog(log: InsertEmotionLog): Promise<EmotionLog>;

  // Resource methods
  getResources(): Promise<Resource[]>;
  getResourceById(id: number): Promise<Resource | undefined>;
  getResourcesByTags(tags: string[]): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;

  // Chat methods
  getChatMessages(userId: number, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class DatabaseStorage implements IStorage {
  // USER METHODS
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserPreferences(id: number, preferences: any): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ preferences })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // TASK METHODS
  async getTasks(userId: number): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: number, updatedFields: Partial<Task>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set(updatedFields)
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id)).returning({ id: tasks.id });
    return result.length > 0;
  }

  // LEARNING MODULE METHODS
  async getLearningModules(): Promise<LearningModule[]> {
    return db.select().from(learningModules);
  }

  async getLearningModuleById(id: number): Promise<LearningModule | undefined> {
    const [module] = await db.select().from(learningModules).where(eq(learningModules.id, id));
    return module;
  }

  async createLearningModule(module: InsertLearningModule): Promise<LearningModule> {
    const [newModule] = await db.insert(learningModules).values(module).returning();
    return newModule;
  }

  // MODULE SECTION METHODS
  async getModuleSections(moduleId: number): Promise<ModuleSection[]> {
    return db
      .select()
      .from(moduleSections)
      .where(eq(moduleSections.moduleId, moduleId))
      .orderBy(asc(moduleSections.order));
  }

  async createModuleSection(section: InsertModuleSection): Promise<ModuleSection> {
    const [newSection] = await db.insert(moduleSections).values(section).returning();
    return newSection;
  }

  async updateModuleSection(id: number, updatedFields: Partial<ModuleSection>): Promise<ModuleSection | undefined> {
    const [updatedSection] = await db
      .update(moduleSections)
      .set(updatedFields)
      .where(eq(moduleSections.id, id))
      .returning();
    return updatedSection;
  }

  // USER PROGRESS METHODS
  async getUserProgress(userId: number, moduleId: number): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.moduleId, moduleId)));
    return progress;
  }

  async updateUserProgress(userId: number, moduleId: number, updatedFields: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const [updatedProgress] = await db
      .update(userProgress)
      .set({ ...updatedFields, lastAccessed: new Date() })
      .where(and(eq(userProgress.userId, userId), eq(userProgress.moduleId, moduleId)))
      .returning();
    return updatedProgress;
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [newProgress] = await db.insert(userProgress).values(progress).returning();
    return newProgress;
  }

  // EMOTION TRACKING METHODS
  async getEmotionLogs(userId: number, limit?: number): Promise<EmotionLog[]> {
    const query = db
      .select()
      .from(emotionLogs)
      .where(eq(emotionLogs.userId, userId))
      .orderBy(desc(emotionLogs.timestamp));

    if (limit) {
      return query.limit(limit);
    }
    return query;
  }

  async createEmotionLog(log: InsertEmotionLog): Promise<EmotionLog> {
    const [newLog] = await db.insert(emotionLogs).values(log).returning();
    return newLog;
  }

  // RESOURCE METHODS
  async getResources(): Promise<Resource[]> {
    return db.select().from(resources);
  }

  async getResourceById(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }

  async getResourcesByTags(tags: string[]): Promise<Resource[]> {
    if (tags.length === 0) return [];
    return db
      .select()
      .from(resources)
      .where(sql`${resources.tags} && ${tags}`);
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db.insert(resources).values(resource).returning();
    return newResource;
  }

  // CHAT METHODS
  async getChatMessages(userId: number, limit?: number): Promise<ChatMessage[]> {
    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(asc(chatMessages.timestamp));

    if (limit) {
      return messages.slice(-limit);
    }
    return messages;
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }
}

export const storage = new DatabaseStorage();

/**
 * Seed the database with demo data on first run (only if empty).
 * This keeps the demo experience intact while persisting real, live data going forward.
 */
export async function seedDatabaseIfEmpty() {
  const existingUsers = await db.select().from(users).limit(1);
  if (existingUsers.length > 0) {
    return;
  }

  console.log("Seeding database with initial demo data...");

  const [demoUser] = await db
    .insert(users)
    .values({
      username: "jamie",
      password: "password123",
      name: "Jamie Smith",
      email: "jamie@example.com",
      preferences: { theme: "light", textSize: "medium", highContrast: false, reduceMotion: false },
    })
    .returning();

  const today = new Date();

  await db.insert(tasks).values([
    {
      userId: demoUser.id,
      title: "Morning meditation",
      description: "10 minutes of mindfulness meditation",
      completed: true,
      dueDate: today,
      timeOfDay: "morning",
      priority: 1,
    },
    {
      userId: demoUser.id,
      title: "Check email and calendar",
      description: "Set priority for the day",
      completed: false,
      dueDate: today,
      timeOfDay: "morning",
      priority: 2,
    },
    {
      userId: demoUser.id,
      title: "Job Interview Preparation",
      description: "Review company information and practice responses",
      completed: false,
      dueDate: today,
      timeOfDay: "afternoon",
      priority: 3,
    },
    {
      userId: demoUser.id,
      title: "Learning module: Executive function",
      description: "30 minutes, 2/5 sections completed",
      completed: false,
      dueDate: today,
      timeOfDay: "afternoon",
      priority: 2,
    },
    {
      userId: demoUser.id,
      title: "Exercise: 20 minute walk",
      completed: false,
      dueDate: today,
      timeOfDay: "evening",
      priority: 2,
    },
    {
      userId: demoUser.id,
      title: "Evening wind-down routine",
      description: "No screens, calming tea, reading",
      completed: false,
      dueDate: today,
      timeOfDay: "evening",
      priority: 1,
    },
  ]);

  const [executiveFunctionModule] = await db
    .insert(learningModules)
    .values({
      title: "Executive Functioning Skills",
      description: "Master essential skills for organization, planning, and task completion",
      imageUrl:
        "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      totalSections: 5,
    })
    .returning();

  await db.insert(moduleSections).values([
    {
      moduleId: executiveFunctionModule.id,
      title: "Introduction to Time Perception",
      order: 0,
      completed: true,
      content: "Understanding how our brains perceive time and why it can be challenging for those with ADHD and other neurodivergent conditions.",
    },
    {
      moduleId: executiveFunctionModule.id,
      title: "Common Challenges for ADHD",
      order: 1,
      completed: true,
      content: "Exploring specific time management difficulties that people with ADHD face and why traditional approaches often don't work.",
    },
    {
      moduleId: executiveFunctionModule.id,
      title: "Pomodoro Technique and Adaptations",
      order: 2,
      completed: false,
      content: "Learning how to use the Pomodoro technique and modifications that make it more effective for neurodivergent individuals.",
    },
    {
      moduleId: executiveFunctionModule.id,
      title: "Digital Tools for Time Management",
      order: 3,
      completed: false,
      content: "Exploring apps and digital tools specifically designed to help with time management for neurodivergent individuals.",
    },
    {
      moduleId: executiveFunctionModule.id,
      title: "Practice Exercises",
      order: 4,
      completed: false,
      content: "Interactive exercises to practice implementing the time management strategies you've learned.",
    },
  ]);

  await db.insert(userProgress).values({
    userId: demoUser.id,
    moduleId: executiveFunctionModule.id,
    currentSection: 2,
    percentComplete: 60,
  });

  await db.insert(resources).values([
    {
      title: "Interview Success Strategies for ADHD",
      description: "Tips for managing anxiety and showcasing your strengths",
      content: "Comprehensive guide for succeeding in job interviews with ADHD, including preparation strategies, anxiety management, and how to highlight your unique strengths.",
      type: "article",
      tags: ["ADHD", "Career"],
      readTime: 5,
    },
    {
      title: "Understanding Sensory Processing",
      description: "Guide to identifying and managing sensory triggers",
      content: "Comprehensive guide to understanding sensory processing issues, identifying personal triggers, and developing effective coping strategies.",
      type: "guide",
      tags: ["Autism", "SPD"],
      readTime: 8,
    },
    {
      title: "Dyslexia-Friendly Reading Techniques",
      description: "Methods to improve reading comprehension and speed",
      content: "Video tutorial demonstrating effective reading techniques for individuals with dyslexia, including tools, font choices, and comprehension strategies.",
      type: "video",
      tags: ["Dyslexia", "Learning"],
      readTime: 12,
    },
  ]);

  const emotions = ["Calm", "Happy", "Anxious", "Frustrated", "Sad"];
  const intensities = [8, 7, 5, 6, 4, 6, 7];
  const emotionRows = [];
  for (let i = 6; i >= 0; i--) {
    const logDate = new Date(today);
    logDate.setDate(today.getDate() - i);
    emotionRows.push({
      userId: demoUser.id,
      emotion: emotions[Math.floor(Math.random() * emotions.length)],
      intensity: intensities[i],
      notes: "",
      timestamp: logDate,
    });
  }
  await db.insert(emotionLogs).values(emotionRows);

  const dayAgo = today.getTime() - 24 * 60 * 60 * 1000;
  await db.insert(chatMessages).values([
    {
      userId: demoUser.id,
      content: "I have a job interview tomorrow and I'm feeling anxious about it.",
      isUser: true,
      timestamp: new Date(dayAgo),
    },
    {
      userId: demoUser.id,
      content: "It's completely normal to feel anxious before an interview. Would you like some strategies to help manage interview anxiety?",
      isUser: false,
      timestamp: new Date(dayAgo + 1000),
    },
    {
      userId: demoUser.id,
      content: "Yes, that would be really helpful.",
      isUser: true,
      timestamp: new Date(dayAgo + 2000),
    },
    {
      userId: demoUser.id,
      content:
        "Here are some strategies:\n1. Prepare thoroughly - research the company and practice common questions\n2. Use the 4-7-8 breathing technique to calm your nervous system\n3. Arrive early to reduce time pressure\n4. Consider disclosing your neurodivergence if you need accommodations\n5. Focus on your strengths and unique perspective\n\nWould you like to practice with some common interview questions?",
      isUser: false,
      timestamp: new Date(dayAgo + 3000),
    },
  ]);

  console.log("Database seeding complete.");
}
