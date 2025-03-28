import { useState } from "react";
import AccessibilityBar from "@/components/layout/AccessibilityBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Clock, 
  CheckCircle2,
  Star,
  FileBadge,
  BookOpen,
  Calendar,
  ArrowRight
} from "lucide-react";

export default function Careers() {
  // In a real application, this data would come from the API
  const [activeTab, setActiveTab] = useState("job-matching");
  
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Accessibility Controls */}
      <AccessibilityBar />
      
      {/* Career Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Career Development</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Tools and resources to help you thrive in the workplace and develop your career.
        </p>
      </div>
      
      {/* Career Tabs */}
      <Tabs defaultValue="job-matching" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="job-matching">Job Matching</TabsTrigger>
          <TabsTrigger value="workplace-tools">Workplace Tools</TabsTrigger>
          <TabsTrigger value="interview-prep">Interview Prep</TabsTrigger>
          <TabsTrigger value="career-resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="job-matching">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle>Recommended Job Matches</CardTitle>
                  <CardDescription>
                    Based on your skills, preferences, and neurodivergent profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* First job listing */}
                  <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">UX Designer</h3>
                      <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 border-none">
                        90% Match
                      </Badge>
                    </div>
                    <div className="text-neutral-600 dark:text-neutral-400 mb-3 text-sm">NeuroDivergent Technologies</div>
                    <div className="grid grid-cols-2 gap-y-2 mb-4 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-neutral-500" />
                        <span>Remote</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-neutral-500" />
                        <span>Full-time</span>
                      </div>
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1 text-neutral-500" />
                        <span>Mid-level</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1 text-neutral-500" />
                        <span>2+ years exp.</span>
                      </div>
                    </div>
                    <p className="text-sm mb-4">
                      Design user-friendly interfaces for accessibility software with a focus on neurodivergent users. Flexible schedule and quiet workspace options available.
                    </p>
                    <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                      <Star className="h-3 w-3 fill-yellow-400 stroke-yellow-400 mr-1" />
                      <span>Neurodiverse-friendly company</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="rounded-full">UI/UX</Badge>
                      <Badge variant="secondary" className="rounded-full">Accessibility</Badge>
                      <Badge variant="secondary" className="rounded-full">Flexible Hours</Badge>
                    </div>
                  </div>
                  
                  {/* Second job listing */}
                  <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">Data Analyst</h3>
                      <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 border-none">
                        85% Match
                      </Badge>
                    </div>
                    <div className="text-neutral-600 dark:text-neutral-400 mb-3 text-sm">SpectrumData Solutions</div>
                    <div className="grid grid-cols-2 gap-y-2 mb-4 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-neutral-500" />
                        <span>Hybrid</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-neutral-500" />
                        <span>Full-time</span>
                      </div>
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1 text-neutral-500" />
                        <span>Entry-level</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1 text-neutral-500" />
                        <span>1+ years exp.</span>
                      </div>
                    </div>
                    <p className="text-sm mb-4">
                      Analyze complex datasets and create visual reports. Company has a structured onboarding program specifically designed for neurodivergent employees.
                    </p>
                    <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                      <Star className="h-3 w-3 fill-yellow-400 stroke-yellow-400 mr-1" />
                      <span>Autism hiring program</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="rounded-full">Data Analysis</Badge>
                      <Badge variant="secondary" className="rounded-full">Python</Badge>
                      <Badge variant="secondary" className="rounded-full">Visualization</Badge>
                    </div>
                  </div>
                  
                  <Button className="w-full">View More Job Matches</Button>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Your Career Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Profile Strength</h3>
                    <Progress value={75} className="h-2 mb-1" />
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>75% Complete</span>
                      <span>7 of 10 sections</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="text-sm font-medium mb-3">Complete Your Profile</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-success mr-2" />
                          <span className="text-neutral-500">Skills Assessment</span>
                        </div>
                        <span className="text-xs text-success">Complete</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-success mr-2" />
                          <span className="text-neutral-500">Work History</span>
                        </div>
                        <span className="text-xs text-success">Complete</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-neutral-300 dark:text-neutral-600 mr-2" />
                          <span>Workplace Accommodations</span>
                        </div>
                        <Button variant="link" className="h-auto p-0 text-xs">
                          Add
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-neutral-300 dark:text-neutral-600 mr-2" />
                          <span>Portfolio Links</span>
                        </div>
                        <Button variant="link" className="h-auto p-0 text-xs">
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Edit Career Profile
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Career Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900 dark:bg-opacity-30">
                    <div className="text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                      Neurodiversity in Tech Panel
                    </div>
                    <div className="flex items-center text-xs text-primary-600 dark:text-primary-400 mb-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>May, 20 • 2:00 PM</span>
                    </div>
                    <p className="text-xs text-primary-600 dark:text-primary-400">
                      Virtual panel discussion with neurodivergent tech professionals sharing their workplace experiences.
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <div className="text-sm font-medium mb-1">
                      Resume Building Workshop
                    </div>
                    <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>May, 25 • 11:00 AM</span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Learn how to highlight your strengths and unique perspectives on your resume.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="w-full">
                    View All Events
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="workplace-tools">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-primary-600 dark:text-primary-300" />
                </div>
                <CardTitle>Focus Timer</CardTitle>
                <CardDescription>
                  Customizable Pomodoro technique with ADHD-friendly breaks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Personalized focus sessions with flexible timing and visual cues to help maintain attention and productivity.
                </p>
                <Button>Launch Timer</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                  <FileBadge className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <CardTitle>Accommodation Request</CardTitle>
                <CardDescription>
                  Templates for workplace accommodation requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Pre-formatted templates and guidance for requesting accommodations tailored to your specific neurodivergent needs.
                </p>
                <Button>Create Request</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
                  <BookOpen className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <CardTitle>Employer Education</CardTitle>
                <CardDescription>
                  Resources to share with employers and colleagues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Educational materials about neurodiversity in the workplace to foster understanding and inclusion.
                </p>
                <Button>View Resources</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="interview-prep">
          <Card>
            <CardHeader>
              <CardTitle>Interview Preparation</CardTitle>
              <CardDescription>
                Tools and resources to help you prepare for job interviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-medium mb-2">Practice Interviews</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    AI-powered interview simulation with real-time feedback tailored for neurodivergent individuals.
                  </p>
                  <Button>Start Practice</Button>
                </div>
                
                <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-medium mb-2">Common Questions</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    Database of interview questions with tips for answering them from a neurodivergent perspective.
                  </p>
                  <Button>View Questions</Button>
                </div>
                
                <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-medium mb-2">Disclosure Guidance</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    Advice on if, when, and how to disclose your neurodivergence during the interview process.
                  </p>
                  <Button>Read Guide</Button>
                </div>
                
                <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-medium mb-2">Anxiety Management</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    Techniques for managing interview anxiety with exercises specifically designed for neurodivergent individuals.
                  </p>
                  <Button>Explore Techniques</Button>
                </div>
              </div>
              
              <div className="bg-primary-50 dark:bg-primary-900 dark:bg-opacity-20 p-4 rounded-lg border border-primary-200 dark:border-primary-800">
                <h3 className="font-medium text-primary-700 dark:text-primary-300 mb-2">Talk to Haru AI Assistant</h3>
                <p className="text-sm text-primary-600 dark:text-primary-400 mb-4">
                  Get personalized interview coaching and practice with Haru, our AI assistant trained to help neurodivergent job seekers.
                </p>
                <Button>
                  Chat with Haru about Interviews
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="career-resources">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Success Stories</CardTitle>
                <CardDescription>
                  Stories from neurodivergent professionals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b pb-4 border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-medium mb-1">From Struggle to Success in Software Engineering</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    How Emily navigated her ADHD challenges to become a senior developer at a major tech company.
                  </p>
                  <Button variant="link" className="p-0 h-auto">Read Story</Button>
                </div>
                
                <div className="border-b pb-4 border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-medium mb-1">Finding My Place in Marketing</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Marcus shares how his autistic perspective gives him a unique edge in digital marketing analytics.
                  </p>
                  <Button variant="link" className="p-0 h-auto">Read Story</Button>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">My Journey to Self-Employment</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    How Jordan built a freelance design business that accommodates their dyslexia and ADHD.
                  </p>
                  <Button variant="link" className="p-0 h-auto">Read Story</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Legal Rights</CardTitle>
                <CardDescription>
                  Understanding your workplace rights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b pb-4 border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-medium mb-1">ADA and Workplace Accommodations</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Guide to your rights under the Americans with Disabilities Act and how to request accommodations.
                  </p>
                  <Button variant="link" className="p-0 h-auto">Read Guide</Button>
                </div>
                
                <div className="border-b pb-4 border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-medium mb-1">Interview Discrimination</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    How to recognize and address potential discrimination during the hiring process.
                  </p>
                  <Button variant="link" className="p-0 h-auto">Read Guide</Button>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Remote Work Accommodations</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Understanding your rights to remote work as a reasonable accommodation.
                  </p>
                  <Button variant="link" className="p-0 h-auto">Read Guide</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Skill Development</CardTitle>
                <CardDescription>
                  Resources to enhance your career skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b pb-4 border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-medium mb-1">Executive Function for Professionals</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Strategies to improve planning, organization, and time management in the workplace.
                  </p>
                  <Button variant="link" className="p-0 h-auto">Start Course</Button>
                </div>
                
                <div className="border-b pb-4 border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-medium mb-1">Effective Communication</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Techniques for clear communication in professional settings, tailored for neurodivergent individuals.
                  </p>
                  <Button variant="link" className="p-0 h-auto">Start Course</Button>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Sensory-Friendly Workspaces</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    How to set up your workspace to minimize sensory overload and maximize productivity.
                  </p>
                  <Button variant="link" className="p-0 h-auto">Read Guide</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
