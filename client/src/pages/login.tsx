import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const { login, loading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    school: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSchoolChange = (value: string) => {
    setFormData(prev => ({ ...prev, school: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast({
        title: "Input required",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // School is required for student role but will be ignored for admin/superadmin
    if (!formData.school) {
      toast({
        title: "School required",
        description: "Please select your school",
        variant: "destructive",
      });
      return;
    }

    try {
      // The AuthContext will determine the role based on the credentials
      await login({
        username: formData.username,
        password: formData.password,
        school: formData.school,
        role: 'student' // Default role, server will determine actual role based on credentials
      });
    } catch (error) {
      // Error is handled in AuthContext
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="h-20 w-20 mx-auto mb-4 rounded-full shadow-md bg-primary-600 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">M</span>
          </div>
          <h1 className="text-3xl font-bold text-primary-700">NSBM MathsMaster</h1>
          <p className="text-gray-600 mt-2">Inter-School Mathematics Competition</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-center mb-4 text-primary-700">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">School</Label>
                <Select value={formData.school} onValueChange={handleSchoolChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your school" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Royal College">Royal College</SelectItem>
                    <SelectItem value="Visakha Vidyalaya">Visakha Vidyalaya</SelectItem>
                    <SelectItem value="Ananda College">Ananda College</SelectItem>
                    <SelectItem value="Devi Balika Vidyalaya">Devi Balika Vidyalaya</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-4">
                <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</Label>
                <Input 
                  type="text" 
                  id="username" 
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</Label>
                <Input 
                  type="password" 
                  id="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              
              <p className="text-xs text-center text-gray-500 mt-4">
                Enter your credentials to access the system. Admin and Super Admin users can use the same login form.
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
