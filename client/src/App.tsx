import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import About from "@/pages/about";
import Members from "@/pages/members";
import Chat from "@/pages/chat";
import Profile from "@/pages/profile";
import Auth from "@/pages/auth";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isLoading, logoutMutation } = useAuth();

  // Show loading state during auth check or logout to prevent flashing
  if (isLoading || logoutMutation.isPending) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center">
        <div className="text-elegant-white">Loading...</div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={user ? Home : Landing} />
      <Route path="/auth" component={Auth} />
      {user ? (
        <>
          <Route path="/about" component={About} />
          <Route path="/members" component={Members} />
          <Route path="/chat" component={Chat} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </>
      ) : (
        <Route component={Landing} />
      )}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
