import { useQuery } from '@tanstack/react-query';
import AccessibilityBar from "@/components/layout/AccessibilityBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, BookOpen, Clock, CheckCircle2 } from "lucide-react";

export default function Learning() {
  const { data: modules, isPending } = useQuery({
    queryKey: ['/api/learning-modules'],
    queryFn: async () => {
      const res = await fetch('/api/learning-modules');
      if (!res.ok) throw new Error('Failed to fetch learning modules');
      return res.json();
    }
  });
  
  const { data: progressData, isPending: isLoadingProgress } = useQuery({
    queryKey: ['/api/learning-progress', 1],
    queryFn: async () => {
      // In a real implementation, this would fetch progress for all modules
      // Here we're just using our existing endpoint for a single module
      const moduleId = 1;
      const res = await fetch(`/api/learning-progress/${moduleId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch progress');
      return res.json();
    }
  });

  // Get user progress for a specific module
  const getModuleProgress = (moduleId: number) => {
    if (progressData && progressData.moduleId === moduleId) {
      return progressData.percentComplete;
    }
    return 0;
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Accessibility Controls */}
      <AccessibilityBar />
      
      {/* Learning Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Learning Dashboard</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Personalized courses and resources designed for your neurodivergent learning style.
        </p>
      </div>
      
      {/* Learning Tabs */}
      <Tabs defaultValue="my-courses" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="my-courses">My Courses</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-courses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isPending ? (
              Array(3).fill(0).map((_, index) => (
                <Card key={index} className="h-96">
                  <CardContent className="p-0">
                    <Skeleton className="w-full h-48 rounded-t-lg" />
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-8 w-1/3" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              modules?.map((module) => (
                <Card key={module.id} className="overflow-hidden transition-all hover:shadow-md">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={module.imageUrl} 
                      alt={module.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2 text-sm text-neutral-500 dark:text-neutral-400">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{module.totalSections} sections</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>~30 min</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">Progress</span>
                        <span className="text-xs">{getModuleProgress(module.id)}%</span>
                      </div>
                      <Progress value={getModuleProgress(module.id)} className="h-2" />
                    </div>
                    
                    <Button size="sm" className="w-full">
                      {getModuleProgress(module.id) > 0 ? 'Continue' : 'Start Learning'}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="recommended">
          <div className="text-center py-12">
            <CheckCircle2 className="h-16 w-16 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
            <h3 className="text-xl font-medium mb-2">Recommendations Coming Soon</h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
              We're analyzing your learning styles and preferences to suggest personalized courses just for you.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="text-center py-12">
            <CheckCircle2 className="h-16 w-16 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
            <h3 className="text-xl font-medium mb-2">No Completed Courses Yet</h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
              When you complete a learning module, it will appear here to track your progress.
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Learning Strategies Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Neurodivergent Learning Strategies</CardTitle>
          <CardDescription>
            Techniques optimized for different cognitive styles
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <h3 className="font-medium mb-2">Visual Learning</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Techniques using diagrams, mind maps, and color-coding for enhanced comprehension.
            </p>
            <Button variant="link" className="p-0 h-auto text-primary-500 dark:text-primary-400">
              Explore Techniques <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          
          <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <h3 className="font-medium mb-2">Audio Immersion</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Learning through podcasts, audio books and verbal repetition with text-to-speech.
            </p>
            <Button variant="link" className="p-0 h-auto text-primary-500 dark:text-primary-400">
              Explore Techniques <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          
          <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <h3 className="font-medium mb-2">Kinesthetic Methods</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Hands-on learning approaches with interactive exercises and physical movement.
            </p>
            <Button variant="link" className="p-0 h-auto text-primary-500 dark:text-primary-400">
              Explore Techniques <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
