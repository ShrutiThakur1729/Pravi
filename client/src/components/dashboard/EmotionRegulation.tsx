import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmotionLog } from '@shared/schema';
import { 
  Wind, 
  Sparkles,
  SmilePlus,
  ArrowRight
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

type Emotion = {
  name: string;
  emoji: string;
};

const emotions: Emotion[] = [
  { name: 'Calm', emoji: '😌' },
  { name: 'Happy', emoji: '😊' },
  { name: 'Sad', emoji: '😥' },
  { name: 'Anxious', emoji: '😰' },
  { name: 'Frustrated', emoji: '😤' },
];

export default function EmotionRegulation() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { data: emotionLogs, isPending: isLoadingEmotions } = useQuery({
    queryKey: ['/api/emotions'],
    queryFn: async () => {
      const res = await fetch('/api/emotions?limit=7', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch emotion logs');
      return res.json();
    }
  });
  
  const trackEmotionMutation = useMutation({
    mutationFn: async (emotion: string) => {
      return await apiRequest('POST', '/api/emotions', {
        emotion,
        intensity: 5, // Default intensity
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emotions'] });
      toast({
        title: "Emotion tracked",
        description: `You're feeling ${selectedEmotion}. Take care of yourself!`
      });
    }
  });
  
  const handleEmotionClick = (emotion: string) => {
    setSelectedEmotion(emotion);
    trackEmotionMutation.mutate(emotion);
  };
  
  // Get the most recently logged emotion (if any)
  const currentEmotion = emotionLogs && emotionLogs.length > 0 
    ? emotionLogs[0].emotion 
    : null;
  
  // Process emotion logs for weekly chart
  const getWeeklyEmotionData = () => {
    const today = new Date();
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekData = [];
    
    // Create empty data structure for the week
    for (let i = 6; i >= 0; i--) {
      const day = subDays(today, i);
      const dayName = daysOfWeek[day.getDay() === 0 ? 6 : day.getDay() - 1]; // Convert Sunday (0) to 6
      
      weekData.push({
        day: dayName,
        date: format(day, 'yyyy-MM-dd'),
        intensity: 0,
      });
    }
    
    // Fill in data from emotion logs
    if (emotionLogs) {
      emotionLogs.forEach((log: EmotionLog) => {
        const logDate = format(new Date(log.timestamp), 'yyyy-MM-dd');
        const dayIndex = weekData.findIndex(d => d.date === logDate);
        
        if (dayIndex !== -1) {
          weekData[dayIndex].intensity = log.intensity;
        }
      });
    }
    
    return weekData;
  };
  
  const weeklyData = getWeeklyEmotionData();
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6 transition-colors">
      <h2 className="text-xl font-heading font-semibold mb-4">Emotion Regulation</h2>
      
      <div className="space-y-6">
        {/* Mood tracker */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">How are you feeling?</h3>
            {!isLoadingEmotions && currentEmotion && (
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Updated {format(new Date(emotionLogs[0].timestamp), 'h')}h ago
              </span>
            )}
          </div>
          
          {isLoadingEmotions ? (
            <div className="grid grid-cols-5 gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {emotions.map((emotion) => (
                <button
                  key={emotion.name}
                  className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                    currentEmotion === emotion.name
                      ? 'bg-primary-50 dark:bg-primary-900 dark:bg-opacity-20 border-2 border-primary-500'
                      : 'hover:bg-neutral-50 dark:hover:bg-neutral-700'
                  }`}
                  onClick={() => handleEmotionClick(emotion.name)}
                  disabled={trackEmotionMutation.isPending}
                >
                  <span className="text-xl mb-1">{emotion.emoji}</span>
                  <span className={`text-xs ${
                    currentEmotion === emotion.name 
                      ? 'font-medium text-primary-700 dark:text-primary-300' 
                      : ''
                  }`}>
                    {emotion.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Emotion management tools */}
        <div>
          <h3 className="text-sm font-medium mb-3">Quick Tools</h3>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-between p-3 h-auto"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                  <Wind className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                </div>
                <span className="font-medium">Deep Breathing</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-between p-3 h-auto"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                  <Sparkles className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <span className="font-medium">5-Minute Mindfulness</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-between p-3 h-auto"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                  <SmilePlus className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                </div>
                <span className="font-medium">Positive Affirmations</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Weekly mood chart */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Weekly Mood</h3>
            <Button variant="link" className="text-xs p-0 h-auto text-primary-500 dark:text-primary-400 hover:no-underline">
              View Details
            </Button>
          </div>
          
          {isLoadingEmotions ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div className="flex items-end justify-between h-32 px-2">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div 
                    className={`w-4 rounded-t-full ${
                      index < weeklyData.length - 1
                        ? `bg-primary-${Math.min(6, Math.max(2, Math.round(day.intensity / 2)))}00 dark:bg-primary-${Math.min(9, Math.max(5, 10 - Math.round(day.intensity / 2)))}00`
                        : 'bg-primary-500 dark:bg-primary-600'
                    }`}
                    style={{ height: `${Math.max(5, day.intensity * 10)}%` }}
                  ></div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">{day.day}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
