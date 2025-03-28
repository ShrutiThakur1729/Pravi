import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Resource } from '@shared/schema';
import { Badge } from '@/components/ui/badge';

export default function ResourceHub() {
  const { data: resources, isPending } = useQuery({
    queryKey: ['/api/resources'],
    queryFn: async () => {
      const res = await fetch('/api/resources');
      if (!res.ok) throw new Error('Failed to fetch resources');
      return res.json();
    }
  });
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6 transition-colors">
      <h2 className="text-xl font-heading font-semibold mb-4">Resource Hub</h2>
      
      {isPending ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-full h-24 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {resources?.slice(0, 3).map((resource: Resource) => (
            <div 
              key={resource.id} 
              className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              <h3 className="font-medium">{resource.title}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {resource.description}
              </p>
              <div className="flex items-center space-x-2 mt-2 flex-wrap gap-y-1">
                {resource.tags?.map((tag, i) => {
                  // Determine tag color based on tag name
                  let colorClass = '';
                  if (tag === 'ADHD') colorClass = 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300';
                  else if (tag === 'Autism') colorClass = 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300';
                  else if (tag === 'Dyslexia') colorClass = 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300';
                  else if (tag === 'SPD') colorClass = 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300';
                  else if (tag === 'Career') colorClass = 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300';
                  else if (tag === 'Learning') colorClass = 'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300';
                  else colorClass = 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300';
                  
                  return (
                    <Badge key={i} variant="outline" className={`${colorClass} border-none py-1 px-2 rounded-full text-xs`}>
                      {tag}
                    </Badge>
                  );
                })}
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {resource.type === 'video' 
                    ? `Video • ${resource.readTime} min` 
                    : `${resource.readTime} min read`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Button 
        variant="link" 
        className="w-full mt-4 py-2 text-center text-sm text-primary-500 dark:text-primary-400"
      >
        View All Resources
      </Button>
    </div>
  );
}
