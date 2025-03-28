import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { EyeIcon, ArrowRight } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function AccessibilityBar() {
  const { 
    textSize, 
    setTextSize, 
    highContrast, 
    toggleHighContrast, 
    reduceMotion, 
    toggleReduceMotion,
    readingGuide,
    toggleReadingGuide
  } = useAccessibility();

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4 mb-6 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <EyeIcon className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
          <span className="text-sm font-medium">Display Settings:</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* Text size control */}
          <div className="flex items-center space-x-2">
            <span className="text-xs">A</span>
            <Slider
              className="w-20 h-2"
              value={[textSize]}
              min={1}
              max={3}
              step={1}
              onValueChange={(value) => setTextSize(value[0])}
            />
            <span className="text-base">A</span>
          </div>
          
          {/* Contrast toggle */}
          <Button 
            size="sm" 
            variant={highContrast ? "default" : "outline"} 
            onClick={toggleHighContrast}
            className="h-8 px-3 py-1 text-sm rounded-full"
          >
            High Contrast
          </Button>
          
          {/* Reduced motion toggle */}
          <Button 
            size="sm" 
            variant={reduceMotion ? "default" : "outline"} 
            onClick={toggleReduceMotion}
            className="h-8 px-3 py-1 text-sm rounded-full"
          >
            Reduce Motion
          </Button>
          
          {/* Reading guide toggle */}
          <Button 
            size="sm" 
            variant={readingGuide ? "default" : "outline"} 
            onClick={toggleReadingGuide}
            className="h-8 px-3 py-1 text-sm rounded-full"
          >
            Reading Guide
          </Button>
        </div>
        
        <Button variant="link" className="text-sm text-primary-500 dark:text-primary-400 p-0">
          More Options
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}
