import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["student", "admin", "superadmin"]),
  school: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]).default("active"),
});

type FormData = z.infer<typeof formSchema>;

interface UserFormProps {
  initialData?: any;
  userId?: number;
  onSuccess?: () => void;
  defaultRole?: "student" | "admin" | "superadmin";
}

export default function UserForm({ 
  initialData, 
  userId, 
  onSuccess,
  defaultRole = "student"
}: UserFormProps) {
  const { toast } = useToast();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [schools, setSchools] = useState([]); // Manage schools locally

  // Simulate fetching schools (replace with actual API call)
  // useEffect(() => {
  //   const fetchSchools = async () => {
  //     const res = await fetch('/api/schools');
  //     const data = await res.json();
  //     setSchools(data);
  //   };
  //   fetchSchools();
  // }, []);


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      username: "",
      password: "",
      role: defaultRole,
      school: "",
      email: "",
      status: "active",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("POST", "/api/users", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Success",
        description: "User created successfully",
        variant: "default",
      });
      if (onSuccess) onSuccess();
      // Add the new school to the list if it's not already present.
      if (data.school && !schools.includes(data.school)) {
        setSchools([...schools, data.school]);
      }

    },
    onError: (error: any) => {
      setSubmitError(error.message || "Failed to create user");
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("PUT", `/api/users/${userId}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Success",
        description: "User updated successfully",
        variant: "default",
      });
      if (onSuccess) onSuccess();
      // Add the new school to the list if it's not already present.
      if (data.school && !schools.includes(data.school)) {
        setSchools([...schools, data.school]);
      }
    },
    onError: (error: any) => {
      setSubmitError(error.message || "Failed to update user");
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    setSubmitError(null);

    // If role is not student, remove school
    if (data.role !== "student") {
      data.school = "";
    }

    if (userId) {
      // Don't send password if it's empty (for updates)
      if (!data.password) {
        const { password, ...restData } = data;
        updateMutation.mutate(restData as FormData);
      } else {
        updateMutation.mutate(data);
      }
    } else {
      createMutation.mutate(data);
    }
  };

  const selectedRole = form.watch("role");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* ... other form fields ... */}

        {selectedRole === "student" && (
          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add School</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter school name" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* ... rest of the form ... */}
      </form>
    </Form>
  );
}