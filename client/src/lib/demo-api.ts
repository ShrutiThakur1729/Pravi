// High-fidelity local storage database for Pravi Demo Mode (Netlify/static hosting)

const SEED_MODULES = [
  {
    id: 1,
    title: "Executive Functioning Skills",
    description: "Master essential skills for organization, planning, and task completion",
    imageUrl: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    totalSections: 5,
  }
];

const SEED_SECTIONS = [
  { id: 101, moduleId: 1, title: "Introduction to Time Perception", order: 0, completed: false, content: "Understanding how our brains perceive time and why it can be challenging for those with ADHD and other neurodivergent conditions." },
  { id: 102, moduleId: 1, title: "Common Challenges for ADHD", order: 1, completed: false, content: "Exploring specific time management difficulties that people with ADHD face and why traditional approaches often don't work." },
  { id: 103, moduleId: 1, title: "Pomodoro Technique and Adaptations", order: 2, completed: false, content: "Learning how to use the Pomodoro technique and modifications that make it more effective for neurodivergent individuals." },
  { id: 104, moduleId: 1, title: "Digital Tools for Time Management", order: 3, completed: false, content: "Exploring apps and digital tools specifically designed to help with time management for neurodivergent individuals." },
  { id: 105, moduleId: 1, title: "Practice Exercises", order: 4, completed: false, content: "Interactive exercises to practice implementing the time management strategies you've learned." }
];

const SEED_RESOURCES = [
  {
    id: 201,
    title: "Interview Success Strategies for ADHD",
    description: "Tips for managing anxiety and showcasing your strengths",
    content: "Comprehensive guide for succeeding in job interviews with ADHD, including preparation strategies, anxiety management, and how to highlight your unique strengths.",
    type: "article",
    tags: ["ADHD", "Career"],
    readTime: 5,
  },
  {
    id: 202,
    title: "Understanding Sensory Processing",
    description: "Guide to identifying and managing sensory triggers",
    content: "Comprehensive guide to understanding sensory processing issues, identifying personal triggers, and developing effective coping strategies.",
    type: "guide",
    tags: ["Autism", "SPD"],
    readTime: 8,
  },
  {
    id: 203,
    title: "Dyslexia-Friendly Reading Techniques",
    description: "Methods to improve reading comprehension and speed",
    content: "Video tutorial demonstrating effective reading techniques for individuals with dyslexia, including tools, font choices, and comprehension strategies.",
    type: "video",
    tags: ["Dyslexia", "Learning"],
    readTime: 12,
  }
];

const SEED_TASKS = [
  { id: 1, title: "Morning meditation", description: "10 minutes of mindfulness meditation", completed: true, dueDate: new Date().toISOString(), timeOfDay: "morning", priority: 1 },
  { id: 2, title: "Check email and calendar", description: "Set priority for the day", completed: false, dueDate: new Date().toISOString(), timeOfDay: "morning", priority: 2 },
  { id: 3, title: "Job Interview Preparation", description: "Review company information and practice responses", completed: false, dueDate: new Date().toISOString(), timeOfDay: "afternoon", priority: 3 },
  { id: 4, title: "Learning module: Executive function", description: "30 minutes, 2/5 sections completed", completed: false, dueDate: new Date().toISOString(), timeOfDay: "afternoon", priority: 2 }
];

// Helper to get or set local storage
function getStorageItem<T>(key: string, defaultValue: T): T {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(item);
}

function setStorageItem<T>(key: string, val: T) {
  localStorage.setItem(key, JSON.stringify(val));
}

export function isDemoMode() {
  return !!localStorage.getItem("pravi_demo_user");
}

export async function handleDemoRequest(method: string, url: string, body?: any): Promise<Response> {
  const cleanUrl = url.split('?')[0];
  const params = new URLSearchParams(url.split('?')[1] || '');

  // Delay to simulate network
  await new Promise(resolve => setTimeout(resolve, 150));

  // 1. AUTH & USER
  if (cleanUrl === "/api/auth/user") {
    const user = localStorage.getItem("pravi_demo_user");
    if (!user) return new Response(null, { status: 401 });
    return new Response(user, { status: 200 });
  }

  // 2. ONBOARDING
  if (cleanUrl === "/api/onboarding") {
    const status = getStorageItem("pravi_demo_onboarding", { tourCompleted: false });
    return new Response(JSON.stringify(status), { status: 200 });
  }
  if (cleanUrl === "/api/onboarding/complete") {
    const status = { tourCompleted: true };
    setStorageItem("pravi_demo_onboarding", status);
    return new Response(JSON.stringify(status), { status: 200 });
  }

  // 3. TASKS
  if (cleanUrl === "/api/tasks") {
    const tasks = getStorageItem("pravi_demo_tasks", SEED_TASKS);
    if (method === "GET") {
      return new Response(JSON.stringify(tasks), { status: 200 });
    }
    if (method === "POST") {
      const newTask = {
        id: Date.now(),
        completed: false,
        createdAt: new Date().toISOString(),
        ...body
      };
      tasks.push(newTask);
      setStorageItem("pravi_demo_tasks", tasks);
      return new Response(JSON.stringify(newTask), { status: 200 });
    }
  }

  // TASK UPDATE/DELETE BY ID
  if (cleanUrl.startsWith("/api/tasks/")) {
    const taskId = parseInt(cleanUrl.split("/").pop() || "0");
    const tasks = getStorageItem("pravi_demo_tasks", SEED_TASKS);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (method === "PATCH") {
      if (taskIndex === -1) return new Response("Not Found", { status: 404 });
      tasks[taskIndex] = { ...tasks[taskIndex], ...body };
      setStorageItem("pravi_demo_tasks", tasks);
      return new Response(JSON.stringify(tasks[taskIndex]), { status: 200 });
    }

    if (method === "DELETE") {
      if (taskIndex === -1) return new Response("Not Found", { status: 404 });
      const updated = tasks.filter(t => t.id !== taskId);
      setStorageItem("pravi_demo_tasks", updated);
      return new Response(null, { status: 204 });
    }
  }

  // 4. LEARNING MODULES & SECTIONS
  if (cleanUrl === "/api/learning-modules") {
    return new Response(JSON.stringify(SEED_MODULES), { status: 200 });
  }
  if (cleanUrl === "/api/module-sections") {
    const moduleId = parseInt(params.get("moduleId") || "1");
    const filtered = SEED_SECTIONS.filter(s => s.moduleId === moduleId);
    return new Response(JSON.stringify(filtered), { status: 200 });
  }

  // 5. USER PROGRESS
  if (cleanUrl.startsWith("/api/user-progress/")) {
    const moduleId = parseInt(cleanUrl.split("/").pop() || "1");
    const progressMap = getStorageItem<Record<number, any>>("pravi_demo_progress", {
      1: { moduleId: 1, currentSection: 102, percentComplete: 40 }
    });

    if (method === "GET") {
      const prog = progressMap[moduleId] || { moduleId, currentSection: 101, percentComplete: 0 };
      return new Response(JSON.stringify(prog), { status: 200 });
    }

    if (method === "POST" || method === "PATCH" || method === "PUT") {
      progressMap[moduleId] = {
        moduleId,
        currentSection: body.currentSection,
        percentComplete: body.percentComplete,
        lastAccessed: new Date().toISOString()
      };
      setStorageItem("pravi_demo_progress", progressMap);
      return new Response(JSON.stringify(progressMap[moduleId]), { status: 200 });
    }
  }

  // 6. EMOTION LOGS
  if (cleanUrl === "/api/emotion-logs") {
    const logs = getStorageItem("pravi_demo_emotions", [
      { id: 1, emotion: "calm", intensity: 6, notes: "Feeling focused today.", timestamp: new Date().toISOString() }
    ]);
    if (method === "GET") {
      return new Response(JSON.stringify(logs), { status: 200 });
    }
    if (method === "POST") {
      const newLog = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...body
      };
      logs.unshift(newLog);
      setStorageItem("pravi_demo_emotions", logs);
      return new Response(JSON.stringify(newLog), { status: 200 });
    }
  }

  // 7. FOCUS SESSIONS
  if (cleanUrl === "/api/focus-sessions") {
    const sessions = getStorageItem("pravi_demo_sessions", [
      { id: 1, durationMinutes: 25, completedAt: new Date(Date.now() - 3600000).toISOString() }
    ]);
    if (method === "GET") {
      return new Response(JSON.stringify(sessions), { status: 200 });
    }
    if (method === "POST") {
      const newSession = {
        id: Date.now(),
        completedAt: new Date().toISOString(),
        ...body
      };
      sessions.unshift(newSession);
      setStorageItem("pravi_demo_sessions", sessions);
      return new Response(JSON.stringify(newSession), { status: 200 });
    }
  }
  if (cleanUrl === "/api/focus-sessions/today") {
    const sessions = getStorageItem("pravi_demo_sessions", []);
    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    const mins = sessions
      .filter(s => new Date(s.completedAt) >= startOfToday)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
    return new Response(JSON.stringify({ minutes: mins }), { status: 200 });
  }

  // 8. RESOURCES
  if (cleanUrl === "/api/resources") {
    return new Response(JSON.stringify(SEED_RESOURCES), { status: 200 });
  }

  // 9. STREAK
  if (cleanUrl === "/api/streak") {
    // Basic fallback streak calculation
    const tasks = getStorageItem("pravi_demo_tasks", SEED_TASKS);
    const completedCount = tasks.filter(t => t.completed).length;
    const streak = completedCount > 0 ? 3 : 1; // Return a friendly mock streak
    return new Response(JSON.stringify({ streak }), { status: 200 });
  }

  // 10. CHAT (Fallback in case they use client chat route)
  if (cleanUrl === "/api/chat") {
    const chatHistory = getStorageItem("pravi_demo_chat", []);
    if (method === "GET") {
      const limit = parseInt(params.get("limit") || "20");
      return new Response(JSON.stringify(chatHistory.slice(-limit)), { status: 200 });
    }
    if (method === "POST") {
      const newMsg = {
        id: Date.now(),
        content: body.content,
        isUser: body.isUser,
        timestamp: new Date().toISOString()
      };
      chatHistory.push(newMsg);
      setStorageItem("pravi_demo_chat", chatHistory);
      return new Response(JSON.stringify(newMsg), { status: 200 });
    }
  }

  return new Response("Not Found", { status: 404 });
}
