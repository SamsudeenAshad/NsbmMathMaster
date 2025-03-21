import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { User, LoginCredentials } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<User | null>;
  logout: () => Promise<void>;
  error: string | null;
  checkAuth: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Check if user is already authenticated
  const { data, isLoading, isError, refetch } = useQuery<{user: User}>({
    queryKey: ['/api/auth/me'],
    staleTime: 5 * 60 * 1000, // 5 minutes before refetching
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchOnReconnect: true, // Refetch when browser reconnects
    retry: 1, // Only retry once to avoid unnecessary requests
  });
  
  // Handle authentication state changes
  useEffect(() => {
    if (data && data.user) {
      console.log("AuthContext: User authenticated:", data.user.username);
      setUser(data.user);
    } else if (isError) {
      console.log("AuthContext: Authentication error, clearing user state");
      setUser(null);
    }
    
    if (!initialCheckDone && (data || isError)) {
      console.log("AuthContext: Initial auth check completed", !!data?.user);
      setInitialCheckDone(true);
    }
  }, [data, isError, initialCheckDone]);

  // Handle browser refresh and navigation
  useEffect(() => {
    if (initialCheckDone) {
      console.log("AuthContext: Navigation check - location:", location, "user:", !!user);
      
      if (!user && location !== "/") {
        // If not authenticated and not on login page, redirect to login
        console.log("AuthContext: Redirecting unauthenticated user to login");
        navigate("/");
      } else if (user && location === "/") {
        // If authenticated and on login page, redirect based on role
        console.log("AuthContext: Redirecting authenticated user from login page based on role");
        redirectUserBasedOnRole(user);
      }
      // Otherwise, stay on current page
    }
  }, [initialCheckDone, user, location]);
  
  // Explicitly prefetch quiz settings when authenticated to avoid race conditions
  useEffect(() => {
    if (user) {
      console.log("AuthContext: Prefetching quiz settings for authenticated user");
      // Prefetch quiz settings for faster page transitions
      queryClient.prefetchQuery({
        queryKey: ['/api/quiz/settings'],
        staleTime: 2000 // 2 seconds before refetching
      });
      
      // For students, also prefetch questions if quiz has started
      if (user.role === 'student') {
        const quizSettings = queryClient.getQueryData(['/api/quiz/settings']) as {state: string} | undefined;
        if (quizSettings?.state === 'started') {
          console.log("AuthContext: Prefetching questions for student");
          queryClient.prefetchQuery({
            queryKey: ['/api/questions'],
            staleTime: 5000 // 5 seconds
          });
        }
      }
    }
  }, [user, queryClient]);

  // Function to redirect user based on role
  const redirectUserBasedOnRole = (user: User) => {
    if (user.role === 'student') {
      // First check if quiz has started
      const quizState = queryClient.getQueryData(['/api/quiz/settings']) as {state: string} | undefined;
      if (quizState && quizState.state === 'started') {
        navigate('/quiz');
      } else {
        // Check if user is coming from rules page
        if (location === '/rules') {
          navigate('/waiting-room');
        } else {
          // Otherwise, send to rules page first
          navigate('/rules');
        }
      }
    } else if (user.role === 'admin') {
      navigate('/admin');
    } else if (user.role === 'superadmin') {
      navigate('/superadmin');
    }
  };

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Send credentials without specifying role - server will determine role
      const res = await apiRequest('POST', '/api/auth/login', credentials);
      return res.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      setError(null);
      
      // Invalidate cached queries
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.username}!`,
      });

      // Redirect based on user role
      redirectUserBasedOnRole(data.user);
    },
    onError: (error: any) => {
      const message = error.message || "Failed to login";
      setError(message);
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/auth/logout', {});
      return res.json();
    },
    onSuccess: () => {
      setUser(null);
      
      // Clear all cached queries
      queryClient.clear();
      
      navigate('/');
      toast({
        title: "Logged out successfully",
      });
    },
    onError: () => {
      toast({
        title: "Logout failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    },
  });

  const login = async (credentials: LoginCredentials) => {
    try {
      const result = await loginMutation.mutateAsync(credentials);
      return result.user;
    } catch (error) {
      return null;
    }
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };
  
  const checkAuth = async (): Promise<User | null> => {
    try {
      const result = await refetch();
      return result.data?.user || null;
    } catch (error) {
      return null;
    }
  };

  // Provide authentication context
  const value = {
    user,
    loading: isLoading || loginMutation.isPending || logoutMutation.isPending,
    login,
    logout,
    error,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
