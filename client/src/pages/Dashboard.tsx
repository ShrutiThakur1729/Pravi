import AccessibilityBar from "@/components/layout/AccessibilityBar";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import AIAssistant from "@/components/dashboard/AIAssistant";
import DailyPlanner from "@/components/dashboard/DailyPlanner";
import LearningModule from "@/components/dashboard/LearningModule";
import EmotionRegulation from "@/components/dashboard/EmotionRegulation";
import ResourceHub from "@/components/dashboard/ResourceHub";
import CommunitySupport from "@/components/dashboard/CommunitySupport";

export default function Dashboard() {
  // In a real application, we would get userId from authentication context
  const userId = 1;

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Accessibility Controls */}
      <AccessibilityBar />
      
      {/* Welcome section with AI Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <WelcomeSection userId={userId} />
        <AIAssistant userId={userId} />
      </div>
      
      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <DailyPlanner userId={userId} />
          <LearningModule userId={userId} />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <EmotionRegulation userId={userId} />
          <ResourceHub />
          <CommunitySupport />
        </div>
      </div>
    </main>
  );
}
