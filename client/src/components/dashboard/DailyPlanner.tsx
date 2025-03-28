import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Task } from '@shared/schema';
import { SettingsIcon, PlusIcon } from 'lucide-react';
import { format } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

type DailyPlannerProps = {
  userId: number;
};

export default function DailyPlanner({ userId }: DailyPlannerProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskTimeOfDay, setNewTaskTimeOfDay] = useState('morning');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: tasks, isPending } = useQuery({
    queryKey: ['/api/tasks', userId],
    queryFn: async () => {
      const res = await fetch(`/api/tasks/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      return res.json();
    }
  });
  
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number, completed: boolean }) => {
      return await apiRequest('PUT', `/api/tasks/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks', userId] });
    }
  });
  
  const createTaskMutation = useMutation({
    mutationFn: async (task: { userId: number, title: string, description?: string, timeOfDay: string }) => {
      return await apiRequest('POST', '/api/tasks', task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks', userId] });
      setNewTaskTitle('');
      setNewTaskDescription('');
      setIsDialogOpen(false);
      toast({
        title: "Task created",
        description: "Your new task has been added to your planner."
      });
    }
  });
  
  const handleCheckboxChange = (task: Task) => {
    updateTaskMutation.mutate({ id: task.id, completed: !task.completed });
  };
  
  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: "Error",
        description: "Task title cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    createTaskMutation.mutate({
      userId,
      title: newTaskTitle,
      description: newTaskDescription || undefined,
      timeOfDay: newTaskTimeOfDay
    });
  };
  
  const getTasksByTimeOfDay = (timeOfDay: string) => {
    return tasks?.filter(task => task.timeOfDay === timeOfDay) || [];
  };
  
  const today = format(new Date(), 'MMMM d');
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold">Daily Planner</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">Today, {today}</span>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <SettingsIcon className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          </Button>
        </div>
      </div>
      
      {isPending ? (
        <div className="py-20 text-center text-neutral-500 dark:text-neutral-400">
          Loading your tasks...
        </div>
      ) : (
        <div className="space-y-4">
          {/* Morning Section */}
          <div>
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-3">MORNING</h3>
            {getTasksByTimeOfDay('morning').map(task => (
              <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                <Checkbox 
                  checked={task.completed} 
                  onCheckedChange={() => handleCheckboxChange(task)} 
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`${task.completed ? 'text-neutral-500 dark:text-neutral-400 line-through' : 'font-medium'}`}>
                      {task.title}
                    </span>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">
                      {task.dueDate ? format(new Date(task.dueDate), 'h:mm a') : ''}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{task.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Afternoon Section */}
          <div>
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-3">AFTERNOON</h3>
            {getTasksByTimeOfDay('afternoon').map(task => (
              <div 
                key={task.id} 
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  task.priority >= 3 
                    ? 'bg-primary-50 dark:bg-primary-900 dark:bg-opacity-20 border-l-4 border-primary-500' 
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-700'
                }`}
              >
                <Checkbox 
                  checked={task.completed} 
                  onCheckedChange={() => handleCheckboxChange(task)} 
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`${
                      task.completed 
                        ? 'text-neutral-500 dark:text-neutral-400 line-through' 
                        : task.priority >= 3 
                          ? 'font-medium text-primary-700 dark:text-primary-300' 
                          : 'font-medium'
                    }`}>
                      {task.title}
                    </span>
                    <span className={`text-xs ${
                      task.priority >= 3 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-neutral-400 dark:text-neutral-500'
                    }`}>
                      {task.dueDate ? format(new Date(task.dueDate), 'h:mm a') : ''}
                    </span>
                  </div>
                  {task.description && (
                    <p className={`text-xs mt-1 ${
                      task.priority >= 3 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-neutral-500 dark:text-neutral-400'
                    }`}>
                      {task.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Evening Section */}
          <div>
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-3">EVENING</h3>
            {getTasksByTimeOfDay('evening').map(task => (
              <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                <Checkbox 
                  checked={task.completed} 
                  onCheckedChange={() => handleCheckboxChange(task)} 
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`${task.completed ? 'text-neutral-500 dark:text-neutral-400 line-through' : 'font-medium'}`}>
                      {task.title}
                    </span>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">
                      {task.dueDate ? format(new Date(task.dueDate), 'h:mm a') : ''}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{task.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full mt-4 flex items-center justify-center py-2 px-4 border border-dashed rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            <span>Add Task</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label htmlFor="task-title" className="block text-sm font-medium mb-1">
                Task Title
              </label>
              <Input
                id="task-title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title"
              />
            </div>
            <div>
              <label htmlFor="task-description" className="block text-sm font-medium mb-1">
                Description (optional)
              </label>
              <Textarea
                id="task-description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time of Day</label>
              <div className="flex space-x-2">
                {['morning', 'afternoon', 'evening'].map((time) => (
                  <Button
                    key={time}
                    type="button"
                    variant={newTaskTimeOfDay === time ? 'default' : 'outline'}
                    onClick={() => setNewTaskTimeOfDay(time)}
                    className="capitalize"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleCreateTask} disabled={createTaskMutation.isPending}>
                {createTaskMutation.isPending ? 'Adding...' : 'Add Task'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
