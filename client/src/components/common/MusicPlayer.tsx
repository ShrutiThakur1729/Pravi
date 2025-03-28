import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, 
  VolumeX, Repeat, Shuffle, Music2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define audio tracks for relaxation and focus
const audioTracks = [
  {
    id: 1,
    title: 'Gentle Rain',
    category: 'Relaxation',
    url: 'https://cdn.freesound.org/previews/346/346170_5143926-lq.mp3'
  },
  {
    id: 2,
    title: 'Ocean Waves',
    category: 'Relaxation',
    url: 'https://cdn.freesound.org/previews/419/419407_8376562-lq.mp3'
  },
  {
    id: 3,
    title: 'Forest Ambience',
    category: 'Relaxation',
    url: 'https://cdn.freesound.org/previews/406/406075_7552181-lq.mp3'
  },
  {
    id: 4,
    title: 'Focus Beats',
    category: 'Focus',
    url: 'https://cdn.freesound.org/previews/628/628403_6374659-lq.mp3'
  },
  {
    id: 5,
    title: 'Deep Concentration',
    category: 'Focus',
    url: 'https://cdn.freesound.org/previews/380/380156_1935990-lq.mp3'
  },
  {
    id: 6,
    title: 'Calm Piano',
    category: 'Focus',
    url: 'https://cdn.freesound.org/previews/417/417089_7609793-lq.mp3'
  }
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [category, setCategory] = useState('All');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Filter tracks by category
  const filteredTracks = category === 'All' 
    ? audioTracks 
    : audioTracks.filter(track => track.category === category);
  
  const currentTrack = filteredTracks[currentTrackIndex];

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.url);
      audioRef.current.volume = volume;
      
      // Set up audio event listeners
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) setDuration(audioRef.current.duration);
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
      });
      
      audioRef.current.addEventListener('ended', handleTrackEnd);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('loadedmetadata', () => {});
        audioRef.current.removeEventListener('timeupdate', () => {});
        audioRef.current.removeEventListener('ended', handleTrackEnd);
      }
    };
  }, []);

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex, currentTrack]);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle track end
  const handleTrackEnd = () => {
    if (isLooping) {
      // Restart the same track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
    } else if (isShuffle) {
      // Play a random track
      const randomIndex = Math.floor(Math.random() * filteredTracks.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      // Play next track
      handleNext();
    }
  };

  // Go to previous track
  const handlePrevious = () => {
    const newIndex = (currentTrackIndex - 1 + filteredTracks.length) % filteredTracks.length;
    setCurrentTrackIndex(newIndex);
  };

  // Go to next track
  const handleNext = () => {
    const newIndex = (currentTrackIndex + 1) % filteredTracks.length;
    setCurrentTrackIndex(newIndex);
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Toggle repeat
  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  // Toggle shuffle
  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  // Format time in minutes:seconds
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle seek in track
  const handleSeek = (newValue: number[]) => {
    if (audioRef.current) {
      const newTime = newValue[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCurrentTrackIndex(0);
  };

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg flex items-center">
            <Music2 className="mr-2 h-5 w-5" /> Pravi Music Player
          </span>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Sounds</SelectItem>
              <SelectItem value="Relaxation">Relaxation</SelectItem>
              <SelectItem value="Focus">Focus</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="text-center mb-2">
          <h3 className="text-lg font-medium">{currentTrack.title}</h3>
          <p className="text-sm text-muted-foreground">{currentTrack.category}</p>
        </div>
        
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          <Slider
            value={[currentTime]} 
            min={0} 
            max={duration || 1} 
            step={0.1} 
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          
          <div className="flex items-center mt-2">
            <span className="mr-2 text-xs">Volume</span>
            <Button
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[volume * 100]} 
              min={0} 
              max={100} 
              step={1}
              className="mx-2"
              onValueChange={(newValue) => setVolume(newValue[0] / 100)}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex w-full justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleLoop}
            className={isLooping ? "text-primary" : ""}
          >
            <Repeat className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handlePrevious}>
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button variant="default" size="icon" onClick={togglePlay} className="h-10 w-10">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <Button variant="ghost" size="icon" onClick={handleNext}>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleShuffle} 
            className={isShuffle ? "text-primary" : ""}
          >
            <Shuffle className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}