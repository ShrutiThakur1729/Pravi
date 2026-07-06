import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BrainCircuit,
  ListChecks,
  GraduationCap,
  HeartHandshake,
  BookOpen,
  Sparkles,
} from "lucide-react";
import praviLogo from "@/assets/pravi-logo.webp";

const features = [
  {
    icon: ListChecks,
    title: "Daily Planner",
    description:
      "Break your day into simple morning, afternoon, and evening tasks that keep you on track without overwhelm.",
  },
  {
    icon: GraduationCap,
    title: "Learning Modules",
    description:
      "Bite-sized lessons on executive functioning, communication, and life skills, built for neurodivergent minds.",
  },
  {
    icon: HeartHandshake,
    title: "Emotion Regulation",
    description:
      "Check in with how you're feeling, track your mood over time, and access quick calming tools when you need them.",
  },
  {
    icon: BrainCircuit,
    title: "Haru, Your AI Assistant",
    description:
      "A friendly AI companion that helps you plan, reflect, and problem-solve whenever you get stuck.",
  },
  {
    icon: BookOpen,
    title: "Resource Hub",
    description:
      "Curated articles, videos, and guides on topics that matter to ADHD, autistic, and dyslexic individuals.",
  },
  {
    icon: Sparkles,
    title: "Community Support",
    description:
      "Connect with a community that understands your experience and celebrates your wins.",
  },
];

export default function Landing() {
  const handleLogin = async () => {
    try {
      const res = await fetch("/api/auth/user").catch(() => null);
      if (res && res.status !== 404) {
        window.location.href = "/api/login";
      } else {
        const mockUser = {
          id: "demo-user",
          email: "demo@pravi.app",
          firstName: "Demo",
          lastName: "User",
          profileImageUrl: "",
        };
        localStorage.setItem("pravi_demo_user", JSON.stringify(mockUser));
        window.location.reload();
      }
    } catch {
      window.location.href = "/api/login";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100">
      {/* Header */}
      <header className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
              <img src={praviLogo} alt="Pravi Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-heading font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              Pravi
            </span>
          </div>
          <Button onClick={handleLogin} data-testid="button-header-login">
            Log In
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6 leading-tight">
          Support built for{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            neurodivergent minds
          </span>
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8">
          Pravi helps people with ADHD, autism, and dyslexia plan their day, build life skills,
          manage emotions, and get support from an AI assistant designed to meet you where you
          are.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" onClick={handleLogin} data-testid="button-hero-login">
            Get Started — It's Free
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-white dark:bg-neutral-800 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-300" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 text-center">
        <Card className="bg-gradient-to-br from-primary-500 to-accent-500 text-white border-none">
          <CardContent className="py-10">
            <h2 className="text-2xl font-heading font-semibold mb-3">Ready to try Pravi?</h2>
            <p className="text-white text-opacity-90 mb-6">
              Sign in to explore a guided demo of your personal dashboard, tasks, and AI assistant.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={handleLogin}
              data-testid="button-cta-login"
            >
              Log In to Get Started
            </Button>
          </CardContent>
        </Card>
      </section>

      <footer className="text-center text-sm text-neutral-500 dark:text-neutral-400 pb-8">
        © {new Date().getFullYear()} Pravi. Built to support every mind.
      </footer>
    </div>
  );
}
