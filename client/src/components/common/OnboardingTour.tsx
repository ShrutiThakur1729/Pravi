import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ListChecks,
  GraduationCap,
  HeartHandshake,
  BrainCircuit,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    icon: Sparkles,
    title: "Welcome to Pravi!",
    description:
      "We've set you up with a sample day so you can see exactly how Pravi works. Let's take a quick look around.",
  },
  {
    icon: ListChecks,
    title: "Plan your day",
    description:
      "The Daily Planner breaks tasks into morning, afternoon, and evening so you're never overwhelmed by a long list.",
  },
  {
    icon: GraduationCap,
    title: "Learn at your pace",
    description:
      "Learning Modules give you bite-sized lessons on executive functioning, communication, and life skills.",
  },
  {
    icon: HeartHandshake,
    title: "Track how you feel",
    description:
      "Log your mood in seconds and get quick access to breathing exercises and calming tools whenever you need them.",
  },
  {
    icon: BrainCircuit,
    title: "Meet Haru",
    description:
      "Haru is your AI assistant, ready to help you plan, reflect, or just talk things through. Look for the chat bubble in the corner.",
  },
];

export function useOnboardingStatus() {
  return useQuery<{ tourCompleted: boolean }>({
    queryKey: ["/api/onboarding"],
    queryFn: async () => {
      const res = await fetch("/api/onboarding", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch onboarding status");
      return res.json();
    },
  });
}

export default function OnboardingTour() {
  const { data, isLoading } = useOnboardingStatus();
  const [stepIndex, setStepIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const completeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/onboarding/complete", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/onboarding"] });
    },
  });

  const isOpen = !isLoading && data?.tourCompleted === false && !dismissed;
  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  const handleClose = () => {
    setDismissed(true);
    completeMutation.mutate();
  };

  const handleNext = () => {
    if (isLastStep) {
      handleClose();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-onboarding-tour">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <step.icon className="h-4 w-4 text-primary-600 dark:text-primary-300" />
            </div>
            {step.title}
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 py-2">
          {step.description}
        </p>

        <div className="flex items-center justify-between pt-4">
          <div className="flex space-x-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-colors ${
                  i === stepIndex ? "bg-primary-500" : "bg-neutral-200 dark:bg-neutral-700"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={completeMutation.isPending}
              data-testid="button-onboarding-skip"
            >
              Skip
            </Button>
            <Button
              size="sm"
              onClick={handleNext}
              disabled={completeMutation.isPending}
              data-testid="button-onboarding-next"
            >
              {isLastStep ? "Get Started" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
