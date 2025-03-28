import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type AccessibilityContextType = {
  theme: string;
  toggleTheme: () => void;
  textSize: number;
  setTextSize: (size: number) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
  readingGuide: boolean;
  toggleReadingGuide: () => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<string>('light');
  const [textSize, setTextSize] = useState<number>(2);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  const [readingGuide, setReadingGuide] = useState<boolean>(false);
  
  useEffect(() => {
    // Check for saved theme preference or respect OS setting
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
    
    // Get stored accessibility preferences
    const storedTextSize = localStorage.getItem('textSize');
    if (storedTextSize) setTextSize(parseInt(storedTextSize));
    
    const storedHighContrast = localStorage.getItem('highContrast');
    if (storedHighContrast) setHighContrast(storedHighContrast === 'true');
    
    const storedReduceMotion = localStorage.getItem('reduceMotion');
    if (storedReduceMotion) setReduceMotion(storedReduceMotion === 'true');
    
    const storedReadingGuide = localStorage.getItem('readingGuide');
    if (storedReadingGuide) setReadingGuide(storedReadingGuide === 'true');
  }, []);
  
  // Apply text size to root element
  useEffect(() => {
    const root = document.documentElement;
    switch (textSize) {
      case 1:
        root.style.fontSize = '14px';
        break;
      case 2:
        root.style.fontSize = '16px';
        break;
      case 3:
        root.style.fontSize = '18px';
        break;
      default:
        root.style.fontSize = '16px';
    }
    localStorage.setItem('textSize', textSize.toString());
  }, [textSize]);
  
  // Apply high contrast
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', highContrast.toString());
  }, [highContrast]);
  
  // Apply reduced motion
  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    localStorage.setItem('reduceMotion', reduceMotion.toString());
  }, [reduceMotion]);
  
  // Apply reading guide
  useEffect(() => {
    let guide: HTMLDivElement | null = null;
    
    if (readingGuide) {
      guide = document.createElement('div');
      guide.id = 'reading-guide';
      guide.style.position = 'fixed';
      guide.style.left = '0';
      guide.style.right = '0';
      guide.style.height = '30px';
      guide.style.background = 'rgba(255, 255, 0, 0.1)';
      guide.style.borderTop = '1px solid rgba(255, 255, 0, 0.3)';
      guide.style.borderBottom = '1px solid rgba(255, 255, 0, 0.3)';
      guide.style.pointerEvents = 'none';
      guide.style.zIndex = '9999';
      guide.style.display = 'none';
      
      document.body.appendChild(guide);
      
      const handleMouseMove = (e: MouseEvent) => {
        if (guide) {
          guide.style.display = 'block';
          guide.style.top = `${e.clientY - 15}px`;
        }
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        if (guide) document.body.removeChild(guide);
      };
    } else {
      const existingGuide = document.getElementById('reading-guide');
      if (existingGuide) document.body.removeChild(existingGuide);
    }
    
    localStorage.setItem('readingGuide', readingGuide.toString());
  }, [readingGuide]);
  
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };
  
  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleReduceMotion = () => setReduceMotion(prev => !prev);
  const toggleReadingGuide = () => setReadingGuide(prev => !prev);
  
  return (
    <AccessibilityContext.Provider
      value={{
        theme,
        toggleTheme,
        textSize,
        setTextSize,
        highContrast,
        toggleHighContrast,
        reduceMotion,
        toggleReduceMotion,
        readingGuide,
        toggleReadingGuide
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
