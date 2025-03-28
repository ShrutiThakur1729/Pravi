import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Sample community data
const communities = [
  {
    id: 1,
    name: 'ADHD Support Group',
    description: 'Next meeting: Tomorrow, 7 PM',
    initial: 'MB',
    color: 'orange',
    online: true,
    joined: false
  },
  {
    id: 2,
    name: 'Autism at Work',
    description: 'Career development forum',
    initial: 'AS',
    color: 'blue',
    online: false,
    joined: true
  },
  {
    id: 3,
    name: 'Neurodiversity Parents',
    description: 'Resources and support',
    initial: 'ND',
    color: 'purple',
    online: false,
    joined: true
  }
];

export default function CommunitySupport() {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-semibold">Community Support</h2>
        <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 border-none">
          5 online
        </Badge>
      </div>
      
      <div className="space-y-3 mb-4">
        {communities.map(community => (
          <div 
            key={community.id} 
            className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full bg-${community.color}-100 dark:bg-${community.color}-900 flex items-center justify-center`}>
                  <span className={`text-${community.color}-600 dark:text-${community.color}-300 font-medium`}>
                    {community.initial}
                  </span>
                </div>
                {community.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-neutral-800"></div>
                )}
              </div>
              <div>
                <p className="font-medium">{community.name}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {community.description}
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant={community.joined ? "outline" : "default"} 
              className={`text-xs py-1 px-3 h-auto ${
                community.joined 
                  ? 'border border-neutral-200 dark:border-neutral-700' 
                  : 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300'
              }`}
            >
              {community.joined ? 'View' : 'Join'}
            </Button>
          </div>
        ))}
      </div>
      
      <Button 
        className="w-full py-2 rounded-lg bg-primary-50 dark:bg-primary-900 dark:bg-opacity-30 text-primary-600 dark:text-primary-300 text-sm font-medium hover:bg-primary-100 dark:hover:bg-opacity-40 transition-colors"
      >
        Find More Communities
      </Button>
    </div>
  );
}
