import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  FocusIcon, 
  Flame, 
  CheckSquare
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';

export default function WelcomeSection() {
  const { user, isLoading: isLoadingUser } = useAuth();
  const displayName = user?.firstName || user?.email?.split('@')[0] || 'there';
  
  // In a real app, these would be fetched from API
  const focusScore = 85;
  const focusChange = 12;
  const learningStreak = 7;
  const tasksCompleted = 12;
  const totalTasks = 15;
  
  return (
    <Card className="col-span-2 bg-white dark:bg-neutral-800 shadow transition-colors">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {isLoadingUser ? (
              <Skeleton className="w-12 h-12 rounded-full" />
            ) : (
              <Avatar className="w-12 h-12 bg-primary-100 dark:bg-primary-900">
                <AvatarFallback className="text-primary-600 dark:text-primary-300 font-medium">
                  {displayName?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <div>
            {isLoadingUser ? (
              <>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64 mb-2" />
                <Skeleton className="h-4 w-56" />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-heading font-semibold mb-2">Welcome back, {displayName}!</h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Your progress this week has been impressive. You've completed 3 learning modules and improved your focus scores by 15%.
                </p>
              </>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg border border-neutral-100 dark:border-neutral-600 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Today's Focus</span>
                  <FocusIcon className="text-primary-500 dark:text-primary-400 h-4 w-4" />
                </div>
                <p className="text-2xl font-semibold">{focusScore}%</p>
                <p className="text-xs text-success">▲ {focusChange}% from yesterday</p>
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg border border-neutral-100 dark:border-neutral-600 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Learning Streak</span>
                  <Flame className="text-warning h-4 w-4" />
                </div>
                <p className="text-2xl font-semibold">{learningStreak} days</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Keep it going!</p>
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg border border-neutral-100 dark:border-neutral-600 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Tasks Completed</span>
                  <CheckSquare className="text-secondary-500 h-4 w-4" />
                </div>
                <p className="text-2xl font-semibold">{tasksCompleted}/{totalTasks}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{totalTasks - tasksCompleted} remaining today</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
