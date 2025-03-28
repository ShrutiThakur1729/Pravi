import { useState } from 'react';
import AccessibilityBar from "@/components/layout/AccessibilityBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import VoiceAssistant from "@/components/common/VoiceAssistant";
import MusicPlayer from "@/components/common/MusicPlayer";
import { 
  Bell,
  Clock,
  Calendar,
  CheckCircle2,
  Brain,
  ListTodo,
  TimerReset,
  Sun,
  MoonStar,
  Volume2,
  VolumeX,
  AlertCircle,
  Music,
  Mic
} from "lucide-react";

// Timer component
function PomodoroTimer() {
  const [timerActive, setTimerActive] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Focus Timer</CardTitle>
        <CardDescription>Customized for ADHD and executive function support</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 rounded-full border-8 border-primary-200 dark:border-primary-800 flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="text-4xl font-bold">{timerActive ? timerMinutes : 25}:00</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">Focus Session</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4 w-full max-w-xs">
            <Button variant="outline" onClick={() => setTimerMinutes(15)}>15 min</Button>
            <Button variant="outline" onClick={() => setTimerMinutes(25)}>25 min</Button>
            <Button variant="outline" onClick={() => setTimerMinutes(40)}>40 min</Button>
          </div>
          
          <Button 
            className="w-full max-w-xs"
            onClick={() => setTimerActive(!timerActive)}
          >
            {timerActive ? 'Pause Timer' : 'Start Focus Session'}
          </Button>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Timer Settings</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="break-duration">Break Duration</Label>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">5 minutes</span>
            </div>
            <Slider 
              id="break-duration"
              defaultValue={[5]} 
              max={15} 
              min={1} 
              step={1} 
              className="w-full" 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <Label htmlFor="timer-sounds">Timer Sounds</Label>
            </div>
            <Switch id="timer-sounds" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <Label htmlFor="visual-alerts">Visual Alerts</Label>
            </div>
            <Switch id="visual-alerts" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4" />
              <Label htmlFor="auto-break">Auto-start Breaks</Label>
            </div>
            <Switch id="auto-break" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Daily Support page component
export default function DailySupport() {
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Accessibility Controls */}
      <AccessibilityBar />
      
      {/* Daily Support Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Daily Support Tools</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Tools and resources to help you manage your daily life and executive functioning.
        </p>
      </div>
      
      {/* Daily Support Tabs */}
      <Tabs defaultValue="focus" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="focus">Focus & Timers</TabsTrigger>
          <TabsTrigger value="routines">Routines</TabsTrigger>
          <TabsTrigger value="sensory">Sensory Tools</TabsTrigger>
          <TabsTrigger value="voice">
            <div className="flex items-center">
              <Music className="h-4 w-4 mr-1" />
              Voice & Sound
            </div>
          </TabsTrigger>
          <TabsTrigger value="notifications">Reminders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="focus">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Today's Focus Plan</CardTitle>
                  <CardDescription>Break your day into manageable tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg flex items-center">
                      <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
                        1
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Morning Focus Block</span>
                          <Badge variant="outline">9:00 - 11:00 AM</Badge>
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Job interview preparation
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg flex items-center">
                      <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
                        2
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Movement Break</span>
                          <Badge variant="outline">11:00 - 11:30 AM</Badge>
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Walking or stretching
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg flex items-center">
                      <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
                        3
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Afternoon Focus Block</span>
                          <Badge variant="outline">1:00 - 3:00 PM</Badge>
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Complete executive function learning module
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg flex items-center">
                      <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
                        4
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Evening Wind-Down</span>
                          <Badge variant="outline">9:00 - 10:00 PM</Badge>
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          No screens, reading, calming activities
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    Customize Focus Plan
                  </Button>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-primary-500" />
                      <CardTitle>Executive Function</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Task Initiation</span>
                        <span className="text-neutral-500">7/10</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Working Memory</span>
                        <span className="text-neutral-500">6/10</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Time Management</span>
                        <span className="text-neutral-500">8/10</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Emotional Regulation</span>
                        <span className="text-neutral-500">7/10</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Detailed Analysis
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <ListTodo className="h-5 w-5 text-primary-500" />
                      <CardTitle>Task Breakdown</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                        <h3 className="font-medium mb-2">Job Interview Preparation</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-success mr-2" />
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">Research company (15 min)</span>
                          </div>
                          <div className="flex items-center">
                            <div className="h-4 w-4 border border-neutral-300 dark:border-neutral-600 rounded-full mr-2"></div>
                            <span className="text-sm">Practice responses (30 min)</span>
                          </div>
                          <div className="flex items-center">
                            <div className="h-4 w-4 border border-neutral-300 dark:border-neutral-600 rounded-full mr-2"></div>
                            <span className="text-sm">Prepare questions (15 min)</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        Add New Task Breakdown
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div>
              <PomodoroTimer />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="routines">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Daily Routines</CardTitle>
                    <Button>Create New Routine</Button>
                  </div>
                  <CardDescription>
                    Structured routines to create predictability and reduce decision fatigue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="morning">
                    <TabsList className="mb-4">
                      <TabsTrigger value="morning">
                        <Sun className="h-4 w-4 mr-2" />
                        Morning
                      </TabsTrigger>
                      <TabsTrigger value="workday">
                        <Clock className="h-4 w-4 mr-2" />
                        Workday
                      </TabsTrigger>
                      <TabsTrigger value="evening">
                        <MoonStar className="h-4 w-4 mr-2" />
                        Evening
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="morning">
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg border-neutral-200 dark:border-neutral-700">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">Wake Up Routine</h3>
                            <Badge>7:00 AM</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="h-5 w-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs text-blue-600 dark:text-blue-300 mr-2">1</div>
                                <span className="text-sm">Drink glass of water</span>
                              </div>
                              <span className="text-xs text-neutral-500">2 min</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="h-5 w-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs text-blue-600 dark:text-blue-300 mr-2">2</div>
                                <span className="text-sm">5-minute stretching</span>
                              </div>
                              <span className="text-xs text-neutral-500">5 min</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="h-5 w-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs text-blue-600 dark:text-blue-300 mr-2">3</div>
                                <span className="text-sm">Shower and get dressed</span>
                              </div>
                              <span className="text-xs text-neutral-500">20 min</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="h-5 w-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs text-blue-600 dark:text-blue-300 mr-2">4</div>
                                <span className="text-sm">Breakfast and medication</span>
                              </div>
                              <span className="text-xs text-neutral-500">15 min</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="h-5 w-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs text-blue-600 dark:text-blue-300 mr-2">5</div>
                                <span className="text-sm">Review today's plan</span>
                              </div>
                              <span className="text-xs text-neutral-500">10 min</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-4 space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button size="sm">Start Routine</Button>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-lg border-neutral-200 dark:border-neutral-700">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">Morning Focus</h3>
                            <Badge>9:00 AM</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="h-5 w-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs text-blue-600 dark:text-blue-300 mr-2">1</div>
                                <span className="text-sm">Set up workspace</span>
                              </div>
                              <span className="text-xs text-neutral-500">5 min</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="h-5 w-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs text-blue-600 dark:text-blue-300 mr-2">2</div>
                                <span className="text-sm">Check email and calendar</span>
                              </div>
                              <span className="text-xs text-neutral-500">15 min</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="h-5 w-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs text-blue-600 dark:text-blue-300 mr-2">3</div>
                                <span className="text-sm">First focus block</span>
                              </div>
                              <span className="text-xs text-neutral-500">45 min</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-4 space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button size="sm">Start Routine</Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="workday">
                      <div className="text-center py-12">
                        <TimerReset className="h-16 w-16 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
                        <h3 className="text-xl font-medium mb-2">Create a Workday Routine</h3>
                        <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6">
                          Structure your workday with predictable routines to improve focus and reduce executive function demands.
                        </p>
                        <Button>Create Workday Routine</Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="evening">
                      <div className="text-center py-12">
                        <TimerReset className="h-16 w-16 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
                        <h3 className="text-xl font-medium mb-2">Create an Evening Routine</h3>
                        <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6">
                          Design a calming evening routine to wind down and prepare for restful sleep.
                        </p>
                        <Button>Create Evening Routine</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Routine Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Weekly Completion Rate</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Consistency Score</span>
                      <span className="text-sm font-medium">73%</span>
                    </div>
                    <Progress value={73} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Current Streak</span>
                      <span className="text-sm font-medium">5 days</span>
                    </div>
                    <Progress value={71} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Routine Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900 dark:bg-opacity-20 border border-primary-200 dark:border-primary-800">
                    <h3 className="font-medium text-primary-700 dark:text-primary-300 mb-1">Consistency is Key</h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      Try to follow your routines at the same time each day to build stronger habits.
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <h3 className="font-medium mb-1">Visual Reminders</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Use visual cues like sticky notes or digital wallpapers to remember routine steps.
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <h3 className="font-medium mb-1">Start Small</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Begin with 3-5 steps and gradually build your routine as habits form.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sensory">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sensory Regulation Tools</CardTitle>
                  <CardDescription>
                    Customize your environment to manage sensory inputs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg border-neutral-200 dark:border-neutral-700">
                      <h3 className="font-medium mb-4">Visual Environment</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="brightness">Screen Brightness</Label>
                            <span className="text-sm text-neutral-500">70%</span>
                          </div>
                          <Slider id="brightness" defaultValue={[70]} max={100} step={1} />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="blue-light">Blue Light Filter</Label>
                            <span className="text-sm text-neutral-500">50%</span>
                          </div>
                          <Slider id="blue-light" defaultValue={[50]} max={100} step={1} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="reduce-motion">Reduce Motion</Label>
                          <Switch id="reduce-motion" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="high-contrast">High Contrast Mode</Label>
                          <Switch id="high-contrast" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg border-neutral-200 dark:border-neutral-700">
                      <h3 className="font-medium mb-4">Audio Environment</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Volume2 className="h-4 w-4 mr-2" />
                              <Label htmlFor="notification-volume">Notification Volume</Label>
                            </div>
                            <span className="text-sm text-neutral-500">30%</span>
                          </div>
                          <Slider id="notification-volume" defaultValue={[30]} max={100} step={1} />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <VolumeX className="h-4 w-4 mr-2" />
                              <Label htmlFor="noise-cancellation">Noise Cancellation</Label>
                            </div>
                            <span className="text-sm text-neutral-500">75%</span>
                          </div>
                          <Slider id="noise-cancellation" defaultValue={[75]} max={100} step={1} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="mute-notifications">Mute Notifications</Label>
                          <Switch id="mute-notifications" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="focus-sounds">Focus Sounds</Label>
                          <Switch id="focus-sounds" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 border rounded-lg border-neutral-200 dark:border-neutral-700">
                    <h3 className="font-medium mb-4">Sensory Overload Management</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button variant="outline" className="flex flex-col items-center h-auto py-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
                          <i className="ri-breath-line text-green-600 dark:text-green-300"></i>
                        </div>
                        <span className="text-sm">Deep Breathing</span>
                      </Button>
                      
                      <Button variant="outline" className="flex flex-col items-center h-auto py-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                          <i className="ri-headphone-line text-blue-600 dark:text-blue-300"></i>
                        </div>
                        <span className="text-sm">White Noise</span>
                      </Button>
                      
                      <Button variant="outline" className="flex flex-col items-center h-auto py-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-2">
                          <i className="ri-focus-3-line text-purple-600 dark:text-purple-300"></i>
                        </div>
                        <span className="text-sm">Grounding</span>
                      </Button>
                      
                      <Button variant="outline" className="flex flex-col items-center h-auto py-4">
                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-2">
                          <i className="ri-calm-line text-amber-600 dark:text-amber-300"></i>
                        </div>
                        <span className="text-sm">Stimming</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sensory Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Visual Sensitivity</span>
                      <span className="text-sm font-medium">High</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Auditory Sensitivity</span>
                      <span className="text-sm font-medium">Medium</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Tactile Sensitivity</span>
                      <span className="text-sm font-medium">Low</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Proprioception</span>
                      <span className="text-sm font-medium">Medium</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                  
                  <Button className="w-full mt-2">Update Sensory Profile</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sensory Toolkit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <h3 className="font-medium mb-1">Noise-Canceling Headphones</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Reduce auditory stimulation in loud environments
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <h3 className="font-medium mb-1">Weighted Blanket</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Provides deep pressure stimulation for calming
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <h3 className="font-medium mb-1">Blue Light Glasses</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Reduces eye strain from screens
                    </p>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Add to Toolkit
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="voice">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Mic className="h-5 w-5 text-primary-500" />
                  <CardTitle>Voice Assistant</CardTitle>
                </div>
                <CardDescription>
                  Use voice commands to control the app and get assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VoiceAssistant onCommand={(command) => {
                  console.log("Voice command received:", command);
                  // Handle command logic here
                }} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Music className="h-5 w-5 text-primary-500" />
                  <CardTitle>Focus & Calming Sounds</CardTitle>
                </div>
                <CardDescription>
                  Background sounds to help you focus or relax
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MusicPlayer />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Reminders & Notifications</CardTitle>
                    <Button>Add New Reminder</Button>
                  </div>
                  <CardDescription>
                    Set up reminders for medication, appointments, and tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900 dark:bg-opacity-20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
                            <i className="ri-medicine-bottle-line text-primary-600 dark:text-primary-300"></i>
                          </div>
                          <div>
                            <h3 className="font-medium text-primary-700 dark:text-primary-300">Medication Reminder</h3>
                            <p className="text-sm text-primary-600 dark:text-primary-400">ADHD medication</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-transparent text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-800">
                          Daily • 9:00 AM
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4 text-sm text-primary-600 dark:text-primary-400">
                          <div className="flex items-center">
                            <Bell className="h-4 w-4 mr-1" />
                            <span>Notification</span>
                          </div>
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span>High Priority</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="h-8 text-primary-600 dark:text-primary-400">Edit</Button>
                          <Button size="sm" className="h-8 bg-primary-600 hover:bg-primary-700">Take Now</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg border-neutral-200 dark:border-neutral-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                          </div>
                          <div>
                            <h3 className="font-medium">Job Interview</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">TechCorp Inc.</p>
                          </div>
                        </div>
                        <Badge variant="outline">Tomorrow • 2:00 PM</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
                          <div className="flex items-center">
                            <Bell className="h-4 w-4 mr-1" />
                            <span>1 hour before</span>
                          </div>
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span>High Priority</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="h-8">Edit</Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg border-neutral-200 dark:border-neutral-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                            <Clock className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                          </div>
                          <div>
                            <h3 className="font-medium">Time to Exercise</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">20-minute walk</p>
                          </div>
                        </div>
                        <Badge variant="outline">Today • 6:30 PM</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
                          <div className="flex items-center">
                            <Bell className="h-4 w-4 mr-1" />
                            <span>15 min before</span>
                          </div>
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span>Medium Priority</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="h-8">Edit</Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg border-neutral-200 dark:border-neutral-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                            <i className="ri-water-flash-line text-green-600 dark:text-green-300"></i>
                          </div>
                          <div>
                            <h3 className="font-medium">Hydration Reminder</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Drink water</p>
                          </div>
                        </div>
                        <Badge variant="outline">Every 2 hours</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
                          <div className="flex items-center">
                            <Bell className="h-4 w-4 mr-1" />
                            <span>Gentle reminder</span>
                          </div>
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span>Low Priority</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="h-8">Edit</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="med-notifications">Medication Reminders</Label>
                    <Switch id="med-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="appointment-reminders">Appointment Reminders</Label>
                    <Switch id="appointment-reminders" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="task-notifications">Task Notifications</Label>
                    <Switch id="task-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="habit-reminders">Habit Reminders</Label>
                    <Switch id="habit-reminders" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="break-reminders">Break Reminders</Label>
                    <Switch id="break-reminders" defaultChecked />
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="reminder-style">Reminder Style</Label>
                    <select id="reminder-style" className="w-full p-2 rounded-md border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
                      <option>Gentle - Text only</option>
                      <option>Standard - Text and sound</option>
                      <option>Persistent - Requires acknowledgment</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Reminder Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <h3 className="font-medium mb-1">Medication Template</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Preset for daily medication reminders
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <h3 className="font-medium mb-1">Appointment Template</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Multiple alerts before appointments
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <h3 className="font-medium mb-1">Task Deadline Template</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Escalating reminders as deadlines approach
                    </p>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Create New Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
