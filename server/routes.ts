import express, { Router, Request, Response } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { processMessage, generateLearningRecommendations, generateCopingStrategies } from "./gemini";
import { z } from "zod";
import { insertTaskSchema, insertEmotionLogSchema, insertChatMessageSchema } from "@shared/schema";

// Input validation schemas
const messageSchema = z.object({
  message: z.string().min(1).max(500),
});

const emotionSchema = z.object({
  emotion: z.string().min(1).max(100),
});

const idParamSchema = z.object({
  id: z.string().transform(val => parseInt(val, 10)),
});

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = Router();
  
  // Health check endpoint
  apiRouter.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // USER ROUTES
  apiRouter.get("/user/:id", async (req: Request, res: Response) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.put("/user/:id/preferences", async (req: Request, res: Response) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const preferences = req.body;
      
      const updatedUser = await storage.updateUserPreferences(id, preferences);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  // TASK ROUTES
  apiRouter.get("/tasks/:userId", async (req: Request, res: Response) => {
    try {
      const { id: userId } = idParamSchema.parse({ id: req.params.userId });
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.post("/tasks", async (req: Request, res: Response) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.put("/tasks/:id", async (req: Request, res: Response) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const taskData = req.body;
      
      const updatedTask = await storage.updateTask(id, taskData);
      
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(updatedTask);
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.delete("/tasks/:id", async (req: Request, res: Response) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const success = await storage.deleteTask(id);
      
      if (!success) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  // LEARNING MODULE ROUTES
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
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.get("/learning-modules/:id/sections", async (req: Request, res: Response) => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const sections = await storage.getModuleSections(id);
      res.json(sections);
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.get("/learning-progress/:userId/:moduleId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const moduleId = parseInt(req.params.moduleId, 10);
      
      const progress = await storage.getUserProgress(userId, moduleId);
      
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.post("/learning-progress", async (req: Request, res: Response) => {
    try {
      const progressData = req.body;
      const progress = await storage.createUserProgress(progressData);
      res.status(201).json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.put("/learning-progress/:userId/:moduleId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const moduleId = parseInt(req.params.moduleId, 10);
      const progressData = req.body;
      
      const updatedProgress = await storage.updateUserProgress(userId, moduleId, progressData);
      
      if (!updatedProgress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      
      res.json(updatedProgress);
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  // EMOTION TRACKING ROUTES
  apiRouter.get("/emotions/:userId", async (req: Request, res: Response) => {
    try {
      const { id: userId } = idParamSchema.parse({ id: req.params.userId });
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      
      const logs = await storage.getEmotionLogs(userId, limit);
      res.json(logs);
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.post("/emotions", async (req: Request, res: Response) => {
    try {
      const logData = insertEmotionLogSchema.parse(req.body);
      const log = await storage.createEmotionLog(logData);
      res.status(201).json(log);
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  // RESOURCE ROUTES
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
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.get("/resources/tags/:tags", async (req: Request, res: Response) => {
    const tags = req.params.tags.split(',');
    const resources = await storage.getResourcesByTags(tags);
    res.json(resources);
  });

  // AI ASSISTANT ROUTES
  apiRouter.get("/chat/:userId", async (req: Request, res: Response) => {
    try {
      const { id: userId } = idParamSchema.parse({ id: req.params.userId });
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      
      const messages = await storage.getChatMessages(userId, limit);
      res.json(messages);
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.post("/chat", async (req: Request, res: Response) => {
    try {
      // Validate user message
      const messageData = insertChatMessageSchema.parse(req.body);
      
      // Save user message to storage
      const savedMessage = await storage.createChatMessage(messageData);
      
      // Get previous messages for context
      const previousMessages = await storage.getChatMessages(messageData.userId, 10);
      const formattedPrevMessages = previousMessages.map(msg => ({
        content: msg.content,
        isUser: msg.isUser
      }));
      
      // Process with AI to get response
      const aiResponse = await processMessage(
        messageData.userId, 
        messageData.content,
        formattedPrevMessages
      );
      
      // Save AI response to storage
      const aiMessageData = {
        userId: messageData.userId,
        content: aiResponse.content,
        isUser: false
      };
      
      const savedAiMessage = await storage.createChatMessage(aiMessageData);
      
      // Return both user message and AI response
      res.status(201).json({
        userMessage: savedMessage,
        aiResponse: {
          message: savedAiMessage,
          suggestions: aiResponse.suggestions
        }
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  // AI RECOMMENDATIONS ROUTES
  apiRouter.post("/ai/learning-recommendations", async (req: Request, res: Response) => {
    try {
      const { userId, interests } = req.body;
      
      if (!userId || !interests || !Array.isArray(interests)) {
        return res.status(400).json({ message: "Invalid request: userId and interests array required" });
      }
      
      const recommendations = await generateLearningRecommendations(userId, interests);
      res.json(recommendations);
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  apiRouter.post("/ai/coping-strategies", async (req: Request, res: Response) => {
    try {
      const { emotion } = emotionSchema.parse(req.body);
      const strategies = await generateCopingStrategies(emotion);
      res.json(strategies);
    } catch (error) {
      res.status(400).json({ message: "Invalid request", error: error.message });
    }
  });

  // Register all API routes with /api prefix
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
