import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useAuth } from '@/hooks/use-auth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Sun, Moon, LogOut } from 'lucide-react';
import praviLogo from '@/assets/pravi-logo.webp';

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Learning', path: '/learning' },
  { name: 'Career', path: '/careers' },
  { name: 'Daily Support', path: '/daily-support' },
  { name: 'Resources', path: '/resources' },
];

export default function Header() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useAccessibility();
  const { user, logout, isLoggingOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  const initials =
    (user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase() +
    (user?.lastName?.[0]?.toUpperCase() || '');

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-white dark:bg-neutral-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
              <img src={praviLogo} alt="Pravi Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-heading font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              <Link href="/">Pravi</Link>
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`${
                  location === item.path
                    ? 'text-primary-500 dark:text-primary-400'
                    : 'text-neutral-600 hover:text-primary-500 dark:text-neutral-300 dark:hover:text-primary-400'
                } font-medium transition-colors`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            {mounted && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-neutral-300" />
                ) : (
                  <Sun className="h-5 w-5 text-neutral-600" />
                )}
              </Button>
            )}
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center focus:outline-none" aria-label="User menu">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-300 font-medium">{initials}</span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user?.email && (
                  <>
                    <div className="px-2 py-1.5 text-sm text-neutral-500 dark:text-neutral-400 truncate">
                      {user.email}
                    </div>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  onClick={() => logout()}
                  disabled={isLoggingOut}
                  className="cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? 'Logging out...' : 'Log out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      className={`block py-2 px-4 rounded-lg ${
                        location === item.path
                          ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:bg-opacity-20 dark:text-primary-400'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
