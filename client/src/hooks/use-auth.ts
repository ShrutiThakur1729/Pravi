import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/models/auth";

async function fetchUser(): Promise<User | null> {
  // If local storage has a demo user, use it
  const demoUser = localStorage.getItem("pravi_demo_user");
  if (demoUser) {
    try {
      return JSON.parse(demoUser);
    } catch {
      localStorage.removeItem("pravi_demo_user");
    }
  }

  try {
    const response = await fetch("/api/auth/user", {
      credentials: "include",
    });

    if (response.status === 401 || response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    // Fallback to null (unauthenticated) if API server is not available (like Netlify static host)
    return null;
  }
}

async function logout(): Promise<void> {
  if (localStorage.getItem("pravi_demo_user")) {
    localStorage.removeItem("pravi_demo_user");
    localStorage.removeItem("pravi_demo_onboarding");
    localStorage.removeItem("pravi_demo_tasks");
    localStorage.removeItem("pravi_demo_emotions");
    localStorage.removeItem("pravi_demo_sessions");
    localStorage.removeItem("pravi_demo_progress");
    localStorage.removeItem("pravi_demo_chat");
    window.location.href = "/";
    return;
  }
  window.location.href = "/api/logout";
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}

