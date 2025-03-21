import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function AppHeader() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout successful",
        description: "You have been logged out successfully.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <header className="bg-primary-100 shadow-sm p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary-900">
          NSBM MathsMaster
        </h1>
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-sm text-primary-700">
              Logged in as: <span className="font-semibold">{user.username}</span> 
              <span className="ml-2 px-2 py-1 bg-primary-200 rounded-full text-xs capitalize">
                {user.role}
              </span>
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="hover:bg-primary-200"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}