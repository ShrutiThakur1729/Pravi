import { useState } from 'react';
import { Bot } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  
  // In a real app, you would get the user ID from auth context
  const userId = 1;
  
  const { data: chatHistory, isPending: isLoadingChat } = useQuery({
    queryKey: ['/api/chat', userId],
    queryFn: async () => {
      const res = await fetch(`/api/chat/${userId}?limit=20`);
      if (!res.ok) throw new Error('Failed to fetch chat history');
      return res.json();
    },
    enabled: isOpen, // Only fetch when dialog is open
  });
  
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest('POST', '/api/chat', {
        userId,
        content,
        isUser: true
      });
      return res.json();
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['/api/chat', userId] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="fixed bottom-6 right-6 z-20 w-14 h-14 rounded-full bg-primary-500 hover:bg-primary-600 text-white shadow-lg flex items-center justify-center transition-colors">
            <Bot className="h-6 w-6" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-600 dark:text-primary-300" />
              </div>
              Haru AI Assistant
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col h-[400px]">
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {isLoadingChat ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-neutral-500 dark:text-neutral-400">Loading conversation...</p>
                </div>
              ) : chatHistory?.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-neutral-500 dark:text-neutral-400">Start a conversation with Haru!</p>
                </div>
              ) : (
                chatHistory?.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.isUser 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-neutral-100 dark:bg-neutral-700'
                      }`}
                    >
                      {!msg.isUser && (
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 text-xs">
                              <Bot className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">Haru</span>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <div className="text-right text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {sendMessageMutation.isPending && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-neutral-100 dark:bg-neutral-700">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 text-xs">
                          <Bot className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">Haru</span>
                    </div>
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSendMessage} className="mt-4 border-t p-3 flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={sendMessageMutation.isPending}
              />
              <Button type="submit" disabled={sendMessageMutation.isPending || !message.trim()}>
                Send
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
