import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  school: z.string().min(1, "School is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});

type FormData = z.infer<typeof formSchema>;

export default function StudentForm() {
  const { login, isLoading } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      school: "",
      username: "",
      password: ""
    }
  });
  
  const { data: users = [], isLoading: isLoadingSchools } = useQuery({
    queryKey: ["/api/users"],
  });
  
  // Get unique schools from users
  const schools = [...new Set(users
    .filter(user => user.school)
    .map(user => ({ id: user.id, name: user.school })))
  ];
  
  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    try {
      await login(data.username, data.password, data.school);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Login failed. Please try again.");
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="school"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">School</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isLoading || isLoadingSchools}
              >
                <FormControl>
                  <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <SelectValue placeholder="Select your school" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Ananda Balika Vidyalaya, Colombo">Ananda Balika Vidyalaya, Colombo</SelectItem>
                  <SelectItem value="Ananda College, Colombo">Ananda College, Colombo</SelectItem>
                  <SelectItem value="Asoka College, Colombo">Asoka College, Colombo</SelectItem>
                  <SelectItem value="Devi Balika Vidyalaya, Colombo">Devi Balika Vidyalaya, Colombo</SelectItem>
                  <SelectItem value="D.S. Senanayake College, Colombo">D.S. Senanayake College, Colombo</SelectItem>
                  <SelectItem value="Gothami Balika Vidyalaya, Colombo">Gothami Balika Vidyalaya, Colombo</SelectItem>
                  <SelectItem value="Hindu College, Colombo">Hindu College, Colombo</SelectItem>
                  <SelectItem value="Isipathana College, Colombo">Isipathana College, Colombo</SelectItem>
                  <SelectItem value="Mahanama College, Colombo">Mahanama College, Colombo</SelectItem>
                  <SelectItem value="Muslim Ladies College, Colombo">Muslim Ladies College, Colombo</SelectItem>
                  <SelectItem value="Nalanda College, Colombo">Nalanda College, Colombo</SelectItem>
                  <SelectItem value="Ramanathan Hindu Ladies College, Colombo">Ramanathan Hindu Ladies College, Colombo</SelectItem>
                  <SelectItem value="Royal College, Colombo">Royal College, Colombo</SelectItem>
                  <SelectItem value="Sirimavo Bandaranaike Balika Vidyalaya, Colombo">Sirimavo Bandaranaike Balika Vidyalaya, Colombo</SelectItem>
                  <SelectItem value="St Paul's Girls School, Colombo">St Paul's Girls School, Colombo</SelectItem>
                  <SelectItem value="Thurston College, Colombo">Thurston College, Colombo</SelectItem>
                  <SelectItem value="Visakha Vidyalaya, Colombo">Visakha Vidyalaya, Colombo</SelectItem>
                  <SelectItem value="Lumbini College, Colombo">Lumbini College, Colombo</SelectItem>
                  <SelectItem value="Mahinda Rajapaksha Vidyalaya, Homagama">Mahinda Rajapaksha Vidyalaya, Homagama</SelectItem>
                  <SelectItem value="Rathnavali Balika MV, Gampaha">Rathnavali Balika MV, Gampaha</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Username</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Enter your username" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Password</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="password" 
                  placeholder="Enter your password" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {submitError && (
          <div className="text-red-500 text-sm">{submitError}</div>
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
