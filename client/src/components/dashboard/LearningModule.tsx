import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Circle, 
  CircleDot,
  MoreHorizontal,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type LearningModuleProps = {
  userId: number;
  moduleId?: number;
};

export default function LearningModule({ userId, moduleId = 1 }: LearningModuleProps) {
  const { data: module, isPending: isLoadingModule } = useQuery({
    queryKey: [`/api/learning-modules/${moduleId}`],
    queryFn: async () => {
      const res = await fetch(`/api/learning-modules/${moduleId}`);
      if (!res.ok) throw new Error('Failed to fetch learning module');
      return res.json();
    }
  });
  
  const { data: sections, isPending: isLoadingSections } = useQuery({
    queryKey: [`/api/learning-modules/${moduleId}/sections`],
    queryFn: async () => {
      const res = await fetch(`/api/learning-modules/${moduleId}/sections`);
      if (!res.ok) throw new Error('Failed to fetch module sections');
      return res.json();
    }
  });
  
  const { data: progress, isPending: isLoadingProgress } = useQuery({
    queryKey: [`/api/learning-progress`, userId, moduleId],
    queryFn: async () => {
      const res = await fetch(`/api/learning-progress/${userId}/${moduleId}`);
      if (!res.ok) throw new Error('Failed to fetch progress');
      return res.json();
    }
  });
  
  const isLoading = isLoadingModule || isLoadingSections || isLoadingProgress;
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold">Learning Module</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">Continue where you left off</p>
        </div>
        <Button variant="ghost" size="icon" aria-label="More options">
          <MoreHorizontal className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
        </Button>
      </div>
      
      {isLoading ? (
        <>
          <Skeleton className="w-full h-48 rounded-lg mb-6" />
          <Skeleton className="w-3/4 h-6 mb-4" />
          <div className="space-y-3">
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-full h-5" />
          </div>
        </>
      ) : (
        <>
          <div className="relative mb-6">
            <div className="w-full h-48 bg-neutral-200 dark:bg-neutral-700 rounded-lg overflow-hidden">
              <img 
                src={module?.imageUrl} 
                alt={module?.title} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-neutral-800 bg-opacity-90 dark:bg-opacity-90 p-3 rounded-lg shadow-sm transition-colors">
              <h3 className="font-heading font-semibold">{module?.title}</h3>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-1 bg-primary-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500" 
                      style={{ width: `${progress?.percentComplete || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {progress?.percentComplete || 0}% Complete
                  </span>
                </div>
                <span className="text-xs font-medium text-primary-600 dark:text-primary-400">Continue</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">
              Current Section: {sections && sections[progress?.currentSection || 0]?.title}
            </h3>
            
            <div className="space-y-2">
              {sections?.map((section, index) => {
                let Icon;
                if (section.completed) {
                  Icon = CheckCircle2;
                } else if (index === progress?.currentSection) {
                  Icon = CircleDot;
                } else {
                  Icon = Circle;
                }
                
                return (
                  <div key={section.id} className="flex items-center space-x-2">
                    <Icon 
                      className={`h-4 w-4 ${
                        section.completed 
                          ? 'text-success' 
                          : index === progress?.currentSection 
                            ? 'text-primary-500 dark:text-primary-400' 
                            : 'text-neutral-400 dark:text-neutral-500'
                      }`} 
                    />
                    <span 
                      className={`${
                        section.completed 
                          ? 'text-neutral-500 dark:text-neutral-400' 
                          : index === progress?.currentSection 
                            ? 'font-medium' 
                            : 'text-neutral-500 dark:text-neutral-400'
                      }`}
                    >
                      {section.title}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                disabled={progress?.currentSection === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button disabled={progress?.currentSection === (sections?.length - 1)}>
                Continue
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
