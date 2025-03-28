import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AccessibilityBar from "@/components/layout/AccessibilityBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Resource } from '@shared/schema';
import { 
  Search, 
  BookOpen, 
  FileText, 
  Film,
  Bookmark,
  ArrowRight,
  ArrowUpRight,
  Tag
} from "lucide-react";

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const { data: resources, isPending } = useQuery({
    queryKey: ['/api/resources'],
    queryFn: async () => {
      const res = await fetch('/api/resources');
      if (!res.ok) throw new Error('Failed to fetch resources');
      return res.json();
    }
  });
  
  // All unique tags from resources
  const allTags = resources 
    ? Array.from(new Set(resources.flatMap((resource: Resource) => resource.tags || [])))
    : [];
  
  // Filter resources based on search and tags
  const filteredResources = resources
    ? resources.filter((resource: Resource) => {
        // Check if title or description matches search query
        const matchesSearch = searchQuery === '' || 
          resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Check if resource has all selected tags
        const matchesTags = selectedTags.length === 0 || 
          selectedTags.every(tag => resource.tags && resource.tags.includes(tag));
        
        return matchesSearch && matchesTags;
      })
    : [];
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Accessibility Controls */}
      <AccessibilityBar />
      
      {/* Resources Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Resource Hub</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Educational materials and guides for neurodivergent individuals
        </p>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input 
              placeholder="Search resources..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>Advanced Search</Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge 
              key={tag} 
              variant={selectedTags.includes(tag) ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Resource Tabs */}
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {isPending ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
              <h3 className="text-xl font-medium mb-2">No results found</h3>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
              <Button onClick={() => {setSearchQuery(''); setSelectedTags([])}}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource: Resource) => (
                <Card key={resource.id} className="overflow-hidden">
                  <div className="h-2 bg-primary-500"></div>
                  <CardHeader>
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                      {resource.type === 'article' && <FileText className="h-4 w-4 mr-2" />}
                      {resource.type === 'guide' && <BookOpen className="h-4 w-4 mr-2" />}
                      {resource.type === 'video' && <Film className="h-4 w-4 mr-2" />}
                      <span className="capitalize">{resource.type}</span>
                      <span className="mx-2">•</span>
                      <span>{resource.readTime} min{resource.type === 'video' ? ' watch' : ' read'}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.tags?.map((tag, i) => {
                        // Determine tag color based on tag name (same logic as ResourceHub component)
                        let colorClass = '';
                        if (tag === 'ADHD') colorClass = 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300';
                        else if (tag === 'Autism') colorClass = 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300';
                        else if (tag === 'Dyslexia') colorClass = 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300';
                        else if (tag === 'SPD') colorClass = 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300';
                        else if (tag === 'Career') colorClass = 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300';
                        else if (tag === 'Learning') colorClass = 'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300';
                        else colorClass = 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300';
                        
                        return (
                          <Badge key={i} variant="outline" className={`${colorClass} border-none text-xs`}>
                            {tag}
                          </Badge>
                        );
                      })}
                    </div>
                    
                    <p className="text-sm line-clamp-3">
                      {resource.content?.substring(0, 150)}...
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Bookmark className="h-4 w-4" />
                      Save
                    </Button>
                    <Button size="sm" className="gap-1">
                      Read More
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="articles">
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
            <h3 className="text-xl font-medium mb-2">Articles Coming Soon</h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6">
              We're currently organizing our article collection for easy access.
            </p>
            <Button>View All Resources</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="guides">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
            <h3 className="text-xl font-medium mb-2">Guides Coming Soon</h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6">
              We're currently organizing our guide collection for easy access.
            </p>
            <Button>View All Resources</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="videos">
          <div className="text-center py-12">
            <Film className="h-16 w-16 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
            <h3 className="text-xl font-medium mb-2">Videos Coming Soon</h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6">
              We're currently organizing our video collection for easy access.
            </p>
            <Button>View All Resources</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          <div className="text-center py-12">
            <Bookmark className="h-16 w-16 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
            <h3 className="text-xl font-medium mb-2">No Saved Resources</h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6">
              You haven't saved any resources yet. Save resources to access them quickly later.
            </p>
            <Button>Explore Resources</Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Featured Resources */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Featured Resources</CardTitle>
          <CardDescription>Highly recommended materials for neurodivergent individuals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900 dark:bg-opacity-20">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-100 border-none">
                  ADHD
                </Badge>
                <Badge className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 hover:bg-green-100 border-none">
                  Focus
                </Badge>
              </div>
              <h3 className="font-medium mb-2 text-primary-700 dark:text-primary-300">ADHD and Time Management</h3>
              <p className="text-sm text-primary-600 dark:text-primary-400 mb-4">
                Comprehensive strategies for managing time when you have ADHD, including techniques for time blindness and procrastination.
              </p>
              <Button variant="outline" className="w-full border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300">
                Read Guide
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 hover:bg-purple-100 border-none">
                  Autism
                </Badge>
                <Badge className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-100 border-none">
                  SPD
                </Badge>
              </div>
              <h3 className="font-medium mb-2">Sensory Processing Guide</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Understanding and managing sensory sensitivities in daily life, with practical strategies for sensory overload.
              </p>
              <Button variant="outline" className="w-full">
                Read Guide
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-100 border-none">
                  Dyslexia
                </Badge>
                <Badge className="bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 hover:bg-teal-100 border-none">
                  Learning
                </Badge>
              </div>
              <h3 className="font-medium mb-2">Dyslexia-Friendly Reading</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Research-backed techniques for improved reading comprehension and speed when you have dyslexia.
              </p>
              <Button variant="outline" className="w-full">
                Watch Video
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Topics Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-heading font-semibold mb-6">Explore by Topic</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Tag className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <span>ADHD Resources</span>
          </Button>
          
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Tag className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <span>Autism Resources</span>
          </Button>
          
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
              <Tag className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <span>Dyslexia Resources</span>
          </Button>
          
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Tag className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <span>SPD Resources</span>
          </Button>
        </div>
      </div>
    </main>
  );
}
