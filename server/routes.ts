import express, { Router, Request, Response } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, seedUserDataIfEmpty } from "./storage";
import { processMessage, generateLearningRecommendations, generateCopingStrategies } from "./gemini";
import { z } from "zod";
import { insertTaskSchema, insertEmotionLogSchema, insertChatMessageSchema } from "@shared/schema";
import { setupAuth, isAuthenticated, registerAuthRoutes } from "./replit_integrations/auth";

// Input validation schemas
const emotionSchema = z.object({
  emotion: z.string().min(1).max(100),
});

const idParamSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

function getUserId(req: Request): string {
  return (req as any).user.claims.sub as string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  const apiRouter = Router();

  // Health check endpoint
  apiRouter.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // AUTH ROUTES (/api/auth/user, /api/login, /api/logout, /api/callback)
  registerAuthRoutes(app);

  // Ensure every user has a populated starter experience the first time they're seen
  apiRouter.get("/onboarding", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      await seedUserDataIfEmpty(userId);
      const status = await storage.getOnboardingStatus(userId);
      res.json({ tourCompleted: status?.tourCompleted ?? false });
    } catch (error: any) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.post("/onboarding/complete", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const status = await storage.markOnboardingComplete(userId);
      res.json(status);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  // TASK ROUTES (scoped to the authenticated user)
  apiRouter.get("/tasks", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      await seedUserDataIfEmpty(userId);
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.post("/tasks", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const taskData = insertTaskSchema.parse({ ...req.body, userId });
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.put("/tasks/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const userId = getUserId(req);

      const existingTask = await storage.getTaskById(id);
      if (!existingTask || existingTask.userId !== userId) {
        return res.status(404).json({ message: "Task not found" });
      }

      const taskData = req.body;
      const updatedTask = await storage.updateTask(id, taskData);
      res.json(updatedTask);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.delete("/tasks/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const userId = getUserId(req);

      const existingTask = await storage.getTaskById(id);
      if (!existingTask || existingTask.userId !== userId) {
        return res.status(404).json({ message: "Task not found" });
      }

      const success = await storage.deleteTask(id);
      if (!success) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  // LEARNING MODULE ROUTES (public content)
  apiRouter.get("/learning-modules", async (_req: Request, res: Response) => {
    const modules = await storage.getLearningModules();
    res.json(modules);
  });

  apiRouter.get("/learning-modules/:id", async (req: Request, res: Response) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const module = await storage.getLearningModuleById(id);

      if (!module) {
        return res.status(404).json({ message: "Learning module not found" });
      }

      res.json(module);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.get("/learning-modules/:id/sections", async (req: Request, res: Response) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const sections = await storage.getModuleSections(id);
      res.json(sections);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  // USER PROGRESS ROUTES (scoped to the authenticated user)
  apiRouter.get("/learning-progress/:moduleId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const moduleId = parseInt(req.params.moduleId, 10);

      const progress = await storage.getUserProgress(userId, moduleId);

      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }

      res.json(progress);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.post("/learning-progress", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const progress = await storage.createUserProgress({ ...req.body, userId });
      res.status(201).json(progress);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.put("/learning-progress/:moduleId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const moduleId = parseInt(req.params.moduleId, 10);
      const progressData = req.body;

      const updatedProgress = await storage.updateUserProgress(userId, moduleId, progressData);

      if (!updatedProgress) {
        return res.status(404).json({ message: "Progress not found" });
      }

      res.json(updatedProgress);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  // EMOTION TRACKING ROUTES (scoped to the authenticated user)
  apiRouter.get("/emotions", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

      const logs = await storage.getEmotionLogs(userId, limit);
      res.json(logs);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.post("/emotions", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const logData = insertEmotionLogSchema.parse({ ...req.body, userId });
      const log = await storage.createEmotionLog(logData);
      res.status(201).json(log);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  // RESOURCE ROUTES (public content)
  apiRouter.get("/resources", async (_req: Request, res: Response) => {
    const resources = await storage.getResources();
    res.json(resources);
  });

  apiRouter.get("/resources/:id", async (req: Request, res: Response) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const resource = await storage.getResourceById(id);

      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      res.json(resource);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.get("/resources/tags/:tags", async (req: Request, res: Response) => {
    const tags = req.params.tags.split(",");
    const resources = await storage.getResourcesByTags(tags);
    res.json(resources);
  });

  // AI ASSISTANT ROUTES (scoped to the authenticated user)
  apiRouter.get("/chat", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

      const messages = await storage.getChatMessages(userId, limit);
      res.json(messages);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.post("/chat", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);

      // Validate and save user message to storage
      const messageData = insertChatMessageSchema.parse({ ...req.body, userId });
      const savedMessage = await storage.createChatMessage(messageData);

      // Get previous messages for context
      const previousMessages = await storage.getChatMessages(userId, 10);
      const formattedPrevMessages = previousMessages.map((msg) => ({
        content: msg.content,
        isUser: !!msg.isUser,
      }));

      // Process with AI to get response
      const aiResponse = await processMessage(userId, messageData.content, formattedPrevMessages);

      // Save AI response to storage
      const savedAiMessage = await storage.createChatMessage({
        userId,
        content: aiResponse.content,
        isUser: false,
      });

      // Return both user message and AI response
      res.status(201).json({
        userMessage: savedMessage,
        aiResponse: {
          message: savedAiMessage,
          suggestions: aiResponse.suggestions,
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  // AI RECOMMENDATIONS ROUTES
  apiRouter.post("/ai/learning-recommendations", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const { interests } = req.body;

      if (!interests || !Array.isArray(interests)) {
        return res.status(400).json({ message: "Invalid request: interests array required" });
      }

      const recommendations = await generateLearningRecommendations(userId, interests);
      res.json(recommendations);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.post("/ai/coping-strategies", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { emotion } = emotionSchema.parse(req.body);
      const strategies = await generateCopingStrategies(emotion);
      res.json(strategies);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  // Register all API routes with /api prefix
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
