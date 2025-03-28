import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Learning from "@/pages/Learning";
import Careers from "@/pages/Careers";
import DailySupport from "@/pages/DailySupport";
import Resources from "@/pages/Resources";

// Import layout components
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingAssistant from "@/components/common/FloatingAssistant";

// Import the AccessibilityProvider
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/learning" component={Learning} />
      <Route path="/careers" component={Careers} />
      <Route path="/daily-support" component={DailySupport} />
      <Route path="/resources" component={Resources} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 transition-colors">
          <Header />
          <Router />
          <Footer />
          <FloatingAssistant />
          <Toaster />
        </div>
      </AccessibilityProvider>
    </QueryClientProvider>
  );
}

export default App;
