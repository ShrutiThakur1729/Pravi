import { 
  User, InsertUser, 
  Task, InsertTask, 
  LearningModule, InsertLearningModule,
  ModuleSection, InsertModuleSection,
  UserProgress, InsertUserProgress,
  EmotionLog, InsertEmotionLog,
  Resource, InsertResource,
  ChatMessage, InsertChatMessage
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private learningModules: Map<number, LearningModule>;
  private moduleSections: Map<number, ModuleSection>;
  private userProgress: Map<string, UserProgress>; // key: userId-moduleId
  private emotionLogs: Map<number, EmotionLog>;
  private resources: Map<number, Resource>;
  private chatMessages: Map<number, ChatMessage>;
  
  private userId: number;
  private taskId: number;
  private moduleId: number;
  private sectionId: number;
  private progressId: number;
  private emotionLogId: number;
  private resourceId: number;
  private chatMessageId: number;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.learningModules = new Map();
    this.moduleSections = new Map();
    this.userProgress = new Map();
    this.emotionLogs = new Map();
    this.resources = new Map();
    this.chatMessages = new Map();
    
    this.userId = 1;
    this.taskId = 1;
    this.moduleId = 1;
    this.sectionId = 1;
    this.progressId = 1;
    this.emotionLogId = 1;
    this.resourceId = 1;
    this.chatMessageId = 1;
    
    // Initialize with demo data
    this.initializeData();
  }

  // USER METHODS
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUserPreferences(id: number, preferences: any): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      preferences
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // TASK METHODS
  async getTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = this.taskId++;
    const newTask: Task = { ...task, id, createdAt: new Date() };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: number, updatedFields: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updatedFields };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // LEARNING MODULE METHODS
  async getLearningModules(): Promise<LearningModule[]> {
    return Array.from(this.learningModules.values());
  }

  async getLearningModuleById(id: number): Promise<LearningModule | undefined> {
    return this.learningModules.get(id);
  }

  async createLearningModule(module: InsertLearningModule): Promise<LearningModule> {
    const id = this.moduleId++;
    const newModule: LearningModule = { ...module, id, createdAt: new Date() };
    this.learningModules.set(id, newModule);
    return newModule;
  }

  // MODULE SECTION METHODS
  async getModuleSections(moduleId: number): Promise<ModuleSection[]> {
    return Array.from(this.moduleSections.values())
      .filter(section => section.moduleId === moduleId)
      .sort((a, b) => a.order - b.order);
  }

  async createModuleSection(section: InsertModuleSection): Promise<ModuleSection> {
    const id = this.sectionId++;
    const newSection: ModuleSection = { ...section, id };
    this.moduleSections.set(id, newSection);
    return newSection;
  }

  async updateModuleSection(id: number, updatedFields: Partial<ModuleSection>): Promise<ModuleSection | undefined> {
    const section = this.moduleSections.get(id);
    if (!section) return undefined;
    
    const updatedSection = { ...section, ...updatedFields };
    this.moduleSections.set(id, updatedSection);
    return updatedSection;
  }

  // USER PROGRESS METHODS
  async getUserProgress(userId: number, moduleId: number): Promise<UserProgress | undefined> {
    const key = `${userId}-${moduleId}`;
    return this.userProgress.get(key);
  }

  async updateUserProgress(userId: number, moduleId: number, updatedFields: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const key = `${userId}-${moduleId}`;
    const progress = this.userProgress.get(key);
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...updatedFields, lastAccessed: new Date() };
    this.userProgress.set(key, updatedProgress);
    return updatedProgress;
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const id = this.progressId++;
    const key = `${progress.userId}-${progress.moduleId}`;
    const newProgress: UserProgress = { ...progress, id, lastAccessed: new Date() };
    this.userProgress.set(key, newProgress);
    return newProgress;
  }

  // EMOTION TRACKING METHODS
  async getEmotionLogs(userId: number, limit?: number): Promise<EmotionLog[]> {
    let logs = Array.from(this.emotionLogs.values())
      .filter(log => log.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
    if (limit) {
      logs = logs.slice(0, limit);
    }
    
    return logs;
  }

  async createEmotionLog(log: InsertEmotionLog): Promise<EmotionLog> {
    const id = this.emotionLogId++;
    const newLog: EmotionLog = { ...log, id, timestamp: new Date() };
    this.emotionLogs.set(id, newLog);
    return newLog;
  }

  // RESOURCE METHODS
  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResourceById(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async getResourcesByTags(tags: string[]): Promise<Resource[]> {
    return Array.from(this.resources.values())
      .filter(resource => 
        resource.tags && tags.some(tag => resource.tags.includes(tag))
      );
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const id = this.resourceId++;
    const newResource: Resource = { ...resource, id, createdAt: new Date() };
    this.resources.set(id, newResource);
    return newResource;
  }

  // CHAT METHODS
  async getChatMessages(userId: number, limit?: number): Promise<ChatMessage[]> {
    let messages = Array.from(this.chatMessages.values())
      .filter(message => message.userId === userId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      
    if (limit) {
      messages = messages.slice(-limit);
    }
    
    return messages;
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageId++;
    const newMessage: ChatMessage = { ...message, id, timestamp: new Date() };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }

  // Initialize sample data for demo purposes
  private initializeData() {
    // Create demo user
    const demoUser: User = {
      id: this.userId++,
      username: 'jamie',
      password: 'password123', // This would be hashed in a real application
      name: 'Jamie Smith',
      email: 'jamie@example.com',
      preferences: { theme: 'light', textSize: 'medium', highContrast: false, reduceMotion: false },
      createdAt: new Date()
    };
    this.users.set(demoUser.id, demoUser);

    // Create demo tasks
    const morningTask1: Task = {
      id: this.taskId++,
      userId: demoUser.id,
      title: 'Morning meditation',
      description: '10 minutes of mindfulness meditation',
      completed: true,
      dueDate: new Date(),
      timeOfDay: 'morning',
      priority: 1,
      createdAt: new Date()
    };
    this.tasks.set(morningTask1.id, morningTask1);

    const morningTask2: Task = {
      id: this.taskId++,
      userId: demoUser.id,
      title: 'Check email and calendar',
      description: 'Set priority for the day',
      completed: false,
      dueDate: new Date(),
      timeOfDay: 'morning',
      priority: 2,
      createdAt: new Date()
    };
    this.tasks.set(morningTask2.id, morningTask2);

    const afternoonTask1: Task = {
      id: this.taskId++,
      userId: demoUser.id,
      title: 'Job Interview Preparation',
      description: 'Review company information and practice responses',
      completed: false,
      dueDate: new Date(),
      timeOfDay: 'afternoon',
      priority: 3,
      createdAt: new Date()
    };
    this.tasks.set(afternoonTask1.id, afternoonTask1);

    const afternoonTask2: Task = {
      id: this.taskId++,
      userId: demoUser.id,
      title: 'Learning module: Executive function',
      description: '30 minutes, 2/5 sections completed',
      completed: false,
      dueDate: new Date(),
      timeOfDay: 'afternoon',
      priority: 2,
      createdAt: new Date()
    };
    this.tasks.set(afternoonTask2.id, afternoonTask2);

    const eveningTask1: Task = {
      id: this.taskId++,
      userId: demoUser.id,
      title: 'Exercise: 20 minute walk',
      completed: false,
      dueDate: new Date(),
      timeOfDay: 'evening',
      priority: 2,
      createdAt: new Date()
    };
    this.tasks.set(eveningTask1.id, eveningTask1);

    const eveningTask2: Task = {
      id: this.taskId++,
      userId: demoUser.id,
      title: 'Evening wind-down routine',
      description: 'No screens, calming tea, reading',
      completed: false,
      dueDate: new Date(),
      timeOfDay: 'evening',
      priority: 1,
      createdAt: new Date()
    };
    this.tasks.set(eveningTask2.id, eveningTask2);

    // Create learning module
    const executiveFunctionModule: LearningModule = {
      id: this.moduleId++,
      title: 'Executive Functioning Skills',
      description: 'Master essential skills for organization, planning, and task completion',
      imageUrl: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      totalSections: 5,
      createdAt: new Date()
    };
    this.learningModules.set(executiveFunctionModule.id, executiveFunctionModule);

    // Create module sections
    const section1: ModuleSection = {
      id: this.sectionId++,
      moduleId: executiveFunctionModule.id,
      title: 'Introduction to Time Perception',
      order: 0,
      completed: true,
      content: 'Understanding how our brains perceive time and why it can be challenging for those with ADHD and other neurodivergent conditions.'
    };
    this.moduleSections.set(section1.id, section1);

    const section2: ModuleSection = {
      id: this.sectionId++,
      moduleId: executiveFunctionModule.id,
      title: 'Common Challenges for ADHD',
      order: 1,
      completed: true,
      content: 'Exploring specific time management difficulties that people with ADHD face and why traditional approaches often don\'t work.'
    };
    this.moduleSections.set(section2.id, section2);

    const section3: ModuleSection = {
      id: this.sectionId++,
      moduleId: executiveFunctionModule.id,
      title: 'Pomodoro Technique and Adaptations',
      order: 2,
      completed: false,
      content: 'Learning how to use the Pomodoro technique and modifications that make it more effective for neurodivergent individuals.'
    };
    this.moduleSections.set(section3.id, section3);

    const section4: ModuleSection = {
      id: this.sectionId++,
      moduleId: executiveFunctionModule.id,
      title: 'Digital Tools for Time Management',
      order: 3,
      completed: false,
      content: 'Exploring apps and digital tools specifically designed to help with time management for neurodivergent individuals.'
    };
    this.moduleSections.set(section4.id, section4);

    const section5: ModuleSection = {
      id: this.sectionId++,
      moduleId: executiveFunctionModule.id,
      title: 'Practice Exercises',
      order: 4,
      completed: false,
      content: 'Interactive exercises to practice implementing the time management strategies you\'ve learned.'
    };
    this.moduleSections.set(section5.id, section5);

    // Create user progress
    const progress: UserProgress = {
      id: this.progressId++,
      userId: demoUser.id,
      moduleId: executiveFunctionModule.id,
      currentSection: 2,
      percentComplete: 60,
      lastAccessed: new Date()
    };
    this.userProgress.set(`${demoUser.id}-${executiveFunctionModule.id}`, progress);

    // Create resources
    const resource1: Resource = {
      id: this.resourceId++,
      title: 'Interview Success Strategies for ADHD',
      description: 'Tips for managing anxiety and showcasing your strengths',
      content: 'Comprehensive guide for succeeding in job interviews with ADHD, including preparation strategies, anxiety management, and how to highlight your unique strengths.',
      type: 'article',
      tags: ['ADHD', 'Career'],
      readTime: 5,
      createdAt: new Date()
    };
    this.resources.set(resource1.id, resource1);

    const resource2: Resource = {
      id: this.resourceId++,
      title: 'Understanding Sensory Processing',
      description: 'Guide to identifying and managing sensory triggers',
      content: 'Comprehensive guide to understanding sensory processing issues, identifying personal triggers, and developing effective coping strategies.',
      type: 'guide',
      tags: ['Autism', 'SPD'],
      readTime: 8,
      createdAt: new Date()
    };
    this.resources.set(resource2.id, resource2);

    const resource3: Resource = {
      id: this.resourceId++,
      title: 'Dyslexia-Friendly Reading Techniques',
      description: 'Methods to improve reading comprehension and speed',
      content: 'Video tutorial demonstrating effective reading techniques for individuals with dyslexia, including tools, font choices, and comprehension strategies.',
      type: 'video',
      tags: ['Dyslexia', 'Learning'],
      readTime: 12,
      createdAt: new Date()
    };
    this.resources.set(resource3.id, resource3);

    // Create sample emotion logs (for the past week)
    const today = new Date();
    const emotions = ['Calm', 'Happy', 'Anxious', 'Frustrated', 'Sad'];
    const intensities = [8, 7, 5, 6, 4, 6, 7];

    for (let i = 6; i >= 0; i--) {
      const logDate = new Date(today);
      logDate.setDate(today.getDate() - i);
      
      const emotionLog: EmotionLog = {
        id: this.emotionLogId++,
        userId: demoUser.id,
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        intensity: intensities[i],
        notes: '',
        timestamp: logDate
      };
      
      this.emotionLogs.set(emotionLog.id, emotionLog);
    }

    // Sample chat messages
    const userMessage1: ChatMessage = {
      id: this.chatMessageId++,
      userId: demoUser.id,
      content: 'I have a job interview tomorrow and I\'m feeling anxious about it.',
      isUser: true,
      timestamp: new Date(today.getTime() - 24 * 60 * 60 * 1000)
    };
    this.chatMessages.set(userMessage1.id, userMessage1);

    const assistantMessage1: ChatMessage = {
      id: this.chatMessageId++,
      userId: demoUser.id,
      content: 'It\'s completely normal to feel anxious before an interview. Would you like some strategies to help manage interview anxiety?',
      isUser: false,
      timestamp: new Date(today.getTime() - 24 * 60 * 60 * 1000 + 1000)
    };
    this.chatMessages.set(assistantMessage1.id, assistantMessage1);

    const userMessage2: ChatMessage = {
      id: this.chatMessageId++,
      userId: demoUser.id,
      content: 'Yes, that would be really helpful.',
      isUser: true,
      timestamp: new Date(today.getTime() - 24 * 60 * 60 * 1000 + 2000)
    };
    this.chatMessages.set(userMessage2.id, userMessage2);

    const assistantMessage2: ChatMessage = {
      id: this.chatMessageId++,
      userId: demoUser.id,
      content: 'Here are some strategies:\n1. Prepare thoroughly - research the company and practice common questions\n2. Use the 4-7-8 breathing technique to calm your nervous system\n3. Arrive early to reduce time pressure\n4. Consider disclosing your neurodivergence if you need accommodations\n5. Focus on your strengths and unique perspective\n\nWould you like to practice with some common interview questions?',
      isUser: false,
      timestamp: new Date(today.getTime() - 24 * 60 * 60 * 1000 + 3000)
    };
    this.chatMessages.set(assistantMessage2.id, assistantMessage2);
  }
}

export const storage = new MemStorage();
