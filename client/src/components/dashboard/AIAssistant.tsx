import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';

type Suggestion = string;

type AIAssistantProps = {
  userId: number;
  initialMessage?: string;
  initialSuggestions?: Suggestion[];
};

export default function AIAssistant({ 
  userId, 
  initialMessage = "Hi Jamie! I noticed you have a job interview tomorrow. Would you like to practice some interview questions or review calming techniques?", 
  initialSuggestions = ["Practice Interview", "Calming Techniques", "Something Else"] 
}: AIAssistantProps) {
  const [message, setMessage] = useState(initialMessage);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions);
  
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest('POST', '/api/chat', {
        userId,
        content,
        isUser: true
      });
      return res.json();
    },
    onSuccess: (data) => {
      setMessage(data.aiResponse.message.content);
      setSuggestions(data.aiResponse.suggestions || []);
    }
  });
  
  const handleSuggestionClick = (suggestion: string) => {
    sendMessageMutation.mutate(suggestion);
  };
  
  return (
    <div className="bg-gradient-to-br from-primary-500 to-accent-500 text-white rounded-lg shadow-lg p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
      <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
      
      <div className="flex items-center space-x-3 mb-4 relative z-10">
        <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${sendMessageMutation.isPending ? 'animate-pulse' : 'pulse-animation'}`}>
          <BrainCircuit className="text-primary-500 h-5 w-5" />
        </div>
        <h3 className="text-xl font-heading font-semibold">Haru AI Assistant</h3>
      </div>
      
      <p className="mb-4 text-white text-opacity-90 relative z-10">
        {sendMessageMutation.isPending ? "Thinking..." : message}
      </p>
      
      <div className="flex flex-wrap gap-2 relative z-10">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            size="sm"
            variant="ghost"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={sendMessageMutation.isPending}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
