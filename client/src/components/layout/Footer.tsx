import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 py-6 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center mr-2">
              <i className="ri-brain-line text-white text-sm"></i>
            </div>
            <span className="font-heading font-bold text-primary-600 dark:text-primary-400">
              <Link href="/">NeuroAssist</Link>
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
            <Link href="#" className="hover:text-primary-500 dark:hover:text-primary-400">About</Link>
            <Link href="#" className="hover:text-primary-500 dark:hover:text-primary-400">Privacy</Link>
            <Link href="#" className="hover:text-primary-500 dark:hover:text-primary-400">Terms</Link>
            <Link href="#" className="hover:text-primary-500 dark:hover:text-primary-400">Contact</Link>
            <Link href="#" className="hover:text-primary-500 dark:hover:text-primary-400">Accessibility</Link>
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-neutral-500 dark:text-neutral-500">
          © {new Date().getFullYear()} NeuroAssist. Designed to support neurodiversity and inclusion.
        </div>
      </div>
    </footer>
  );
}
