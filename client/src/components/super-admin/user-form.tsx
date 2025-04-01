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
                <FormLabel>School</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a school" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Ananda Balika Vidyalaya, Colombo">Ananda Balika Vidyalaya, Colombo</SelectItem>
                    <SelectItem value="Ananda College, Colombo">Ananda College, Colombo</SelectItem>
                    <SelectItem value="Ananda Sastralaya, Kotte">Ananda Sastralaya, Kotte</SelectItem>
                    <SelectItem value="Andiambalama Maha Vidyalaya">Andiambalama Maha Vidyalaya</SelectItem>
                    <SelectItem value="Anula Vidyalaya, Nugegoda">Anula Vidyalaya, Nugegoda</SelectItem>
                    <SelectItem value="Asoka College, Colombo">Asoka College, Colombo</SelectItem>
                    <SelectItem value="Bandaranayaka Vidyalaya, Gampaha">Bandaranayaka Vidyalaya, Gampaha</SelectItem>
                    <SelectItem value="Bandaranayake Central College, Veyangoda">Bandaranayake Central College, Veyangoda</SelectItem>
                    <SelectItem value="Basilica College, Ragama">Basilica College, Ragama</SelectItem>
                    <SelectItem value="Batuwatta Maha Vidyalaya, Ragama">Batuwatta Maha Vidyalaya, Ragama</SelectItem>
                    <SelectItem value="Bishop's College, Colombo">Bishop's College, Colombo</SelectItem>
                    <SelectItem value="Biyagama Madhya Maha Vidyalaya, Biyagama">Biyagama Madhya Maha Vidyalaya, Biyagama</SelectItem>
                    <SelectItem value="Bomiriya Central College, Bomiriya, Kaduwela">Bomiriya Central College, Bomiriya, Kaduwela</SelectItem>
                    <SelectItem value="Boys' Model College, Malabe">Boys' Model College, Malabe</SelectItem>
                    <SelectItem value="D.S. Senanayake College, Colombo">D.S. Senanayake College, Colombo</SelectItem>
                    <SelectItem value="Devi Balika Vidyalaya, Colombo">Devi Balika Vidyalaya, Colombo</SelectItem>
                    <SelectItem value="Hameed Al Husseinie College">Hameed Al Husseinie College</SelectItem>
                    <SelectItem value="Hindu College, Colombo">Hindu College, Colombo</SelectItem>
                    <SelectItem value="Isipathana College, Colombo">Isipathana College, Colombo</SelectItem>
                    <SelectItem value="Mahanama College, Colombo">Mahanama College, Colombo</SelectItem>
                    <SelectItem value="Muslim Ladies College, Colombo">Muslim Ladies College, Colombo</SelectItem>
                    <SelectItem value="Nalanda College, Colombo">Nalanda College, Colombo</SelectItem>
                    <SelectItem value="President's College">President's College</SelectItem>
                    <SelectItem value="Prince of Wales' College, Moratuwa">Prince of Wales' College, Moratuwa</SelectItem>
                    <SelectItem value="Royal College, Colombo">Royal College, Colombo</SelectItem>
                    <SelectItem value="Sirimavo Bandaranaike Balika Vidyalaya, Colombo">Sirimavo Bandaranaike Balika Vidyalaya, Colombo</SelectItem>
                    <SelectItem value="Sri Dharmaloka College">Sri Dharmaloka College</SelectItem>
                    <SelectItem value="SRI Subhuthi National school">SRI Subhuthi National school</SelectItem>
                    <SelectItem value="St Paul's Girls School, Colombo">St Paul's Girls School, Colombo</SelectItem>
                    <SelectItem value="Thurston College, Colombo">Thurston College, Colombo</SelectItem>
                    <SelectItem value="Visakha Vidyalaya, Colombo">Visakha Vidyalaya, Colombo</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
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