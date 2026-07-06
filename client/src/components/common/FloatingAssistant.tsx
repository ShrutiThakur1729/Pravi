import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Mic, MicOff, Volume2, VolumeX, Send, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

// Declare Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Haru 🌸 Your companion on Pravi. I'm here to help you navigate, focus, or just talk. You can type or use your voice — whatever feels easier!",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pulseRing, setPulseRing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Pulse ring animation for listening state
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => setPulseRing(p => !p), 800);
      return () => clearInterval(interval);
    } else {
      setPulseRing(false);
    }
  }, [isListening]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
      // Auto-send after voice input
      setTimeout(() => sendMessage(transcript), 300);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access to use voice with Haru.",
          variant: "destructive",
        });
      }
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => recognition.abort();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Text-to-speech
  const speak = useCallback((text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    // Try to pick a pleasant female voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Samantha') || v.name.includes('Google UK English Female') ||
      v.name.includes('Female') || (v.lang.startsWith('en') && v.name.includes('f'))
    );
    if (preferred) utterance.voice = preferred;

    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  // Stop speaking
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Send message to Haru Netlify function
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: 'user', content: trimmed, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Build history for context (exclude first greeting)
    const history = messages.slice(1).map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch('/.netlify/functions/haru', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to reach Haru');

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      speak(data.reply);
    } catch (err: any) {
      toast({
        title: "Haru is unavailable",
        description: err.message || "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, speak, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support voice input. Try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }
    if (isListening) {
      recognitionRef.current.abort();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const toggleVoiceOutput = () => {
    if (isSpeaking) stopSpeaking();
    setVoiceEnabled(v => !v);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-neutral-700 dark:bg-neutral-800 rotate-0'
            : 'bg-gradient-to-br from-violet-500 to-purple-600 hover:scale-110'
        }`}
        aria-label="Toggle Haru assistant"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Bot className="h-6 w-6 text-white" />
        )}
        {/* Listening indicator ring */}
        {isListening && !isOpen && (
          <span className="absolute inset-0 rounded-full bg-violet-400 animate-ping opacity-60" />
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[560px] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white">
            <div className="relative w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="h-5 w-5" />
              {isSpeaking && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-purple-500 animate-pulse" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm">Haru</span>
                <Sparkles className="h-3.5 w-3.5 opacity-80" />
              </div>
              <p className="text-xs text-white/70 truncate">
                {isListening ? '🎙️ Listening...' : isLoading ? 'Thinking...' : isSpeaking ? '🔊 Speaking...' : 'Your AI companion'}
              </p>
            </div>
            {/* Voice output toggle */}
            <button
              onClick={toggleVoiceOutput}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              title={voiceEnabled ? 'Mute Haru' : 'Unmute Haru'}
            >
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0 max-h-[390px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                    <Bot className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                  </div>
                )}
                <div className={`max-w-[78%] group ${msg.role === 'user' ? '' : ''}`}>
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-tr-sm'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <p className={`text-[10px] text-neutral-400 mt-0.5 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                  <Bot className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            {/* Listening indicator */}
            {isListening && (
              <div className="flex justify-center py-2">
                <div className="flex items-center gap-2 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 px-3 py-1.5 rounded-full">
                  <span className={`w-2 h-2 bg-red-500 rounded-full ${pulseRing ? 'scale-125' : 'scale-100'} transition-transform`} />
                  <span className="text-xs text-violet-700 dark:text-violet-300 font-medium">Listening…</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            {/* Mic button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600'
              }`}
              title={isListening ? 'Stop listening' : 'Speak to Haru'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            <Input
              ref={inputRef}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Type or speak to Haru..."
              disabled={isLoading || isListening}
              className="flex-1 h-9 text-sm rounded-full border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus-visible:ring-violet-500"
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmit(e as any)}
            />

            <Button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              size="icon"
              className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 hover:opacity-90 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
