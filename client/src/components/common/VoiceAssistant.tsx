import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Mic, Square, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type VoiceAssistantProps = {
  onCommand?: (command: string) => void;
};

export default function VoiceAssistant({ onCommand }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          processCommand(finalTranscript);
        } else {
          setTranscript(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          toast({
            title: "Microphone access denied",
            description: "Please allow microphone access to use voice features.",
            variant: "destructive"
          });
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    } else {
      toast({
        title: "Voice Assistant Unavailable",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  // Handle listening state changes
  useEffect(() => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.start();
      } else {
        recognitionRef.current.stop();
      }
    }
  }, [isListening]);

  // Process voice commands
  const processCommand = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase().trim();
    
    // Basic navigation commands
    if (lowerCommand.includes('go to home') || lowerCommand.includes('go home')) {
      window.location.href = '/';
    } else if (lowerCommand.includes('go to learning')) {
      window.location.href = '/learning';
    } else if (lowerCommand.includes('go to careers')) {
      window.location.href = '/careers';
    } else if (lowerCommand.includes('go to daily support')) {
      window.location.href = '/daily-support';
    } else if (lowerCommand.includes('go to resources')) {
      window.location.href = '/resources';
    }
    
    // Pass the command to the parent component for additional processing
    if (onCommand) {
      onCommand(lowerCommand);
    }
  }, [onCommand]);

  // Toggle speech recognition
  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTranscript('');
    }
  };

  // Text-to-speech function
  const speak = (text: string) => {
    if (!voiceEnabled) return;
    
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Text-to-speech unavailable",
        description: "Your browser doesn't support speech synthesis.",
        variant: "destructive"
      });
    }
  };

  // Toggle voice feedback
  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (isSpeaking && voiceEnabled) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Pravi Voice Assistant</h3>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleVoice}
            title={voiceEnabled ? "Mute voice feedback" : "Enable voice feedback"}
          >
            {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className="bg-muted rounded-md p-3 min-h-[60px] mb-2">
          {transcript ? transcript : 'Say "Go to learning" or "Help me with anxiety"'}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between px-4 pb-4 pt-0">
        <Button 
          onClick={toggleListening}
          variant={isListening ? "destructive" : "default"}
          className="w-full"
        >
          {isListening ? (
            <>
              <Square className="mr-2 h-4 w-4" /> Stop Listening
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" /> Start Listening
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Add TypeScript definitions for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}