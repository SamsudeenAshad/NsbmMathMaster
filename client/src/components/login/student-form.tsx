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
                    <SelectItem value="Ananda Sastralaya, Kotte">Ananda Sastralaya, Kotte</SelectItem>
                    <SelectItem value="Andiambalama Maha Vidyalaya">Andiambalama Maha Vidyalaya</SelectItem>
                    <SelectItem value="Anula Vidyalaya, Nugegoda">Anula Vidyalaya, Nugegoda</SelectItem>
                    <SelectItem value="Asoka College, Colombo">Asoka College, Colombo</SelectItem>
                    <SelectItem value="Bandaranayaka Vidyalaya, Gampaha">Bandaranayaka Vidyalaya, Gampaha</SelectItem>
                    <SelectItem value="Bandaranayake Central College, Veyangoda">Bandaranayake Central College, Veyangoda</SelectItem>
                    <SelectItem value="Bomiriya Central College, Bomiriya, Kaduwela">Bomiriya Central College, Bomiriya, Kaduwela</SelectItem>
                    <SelectItem value="Boys' Model College, Malabe">Boys' Model College, Malabe</SelectItem>
                    <SelectItem value="Central College Homagama">Central College Homagama</SelectItem>
                    <SelectItem value="D.S. Senanayake College, Colombo">D.S. Senanayake College, Colombo</SelectItem>
                    <SelectItem value="D.S. Senanayake Central College, Mirigama">D.S. Senanayake Central College, Mirigama</SelectItem>
                    <SelectItem value="Devi Balika Vidyalaya, Colombo">Devi Balika Vidyalaya, Colombo</SelectItem>
                    <SelectItem value="Dharmapala Vidyalaya, Pannipitiya">Dharmapala Vidyalaya, Pannipitiya</SelectItem>
                    <SelectItem value="Galahitiyawa Central College, Ganemulla">Galahitiyawa Central College, Ganemulla</SelectItem>
                    <SelectItem value="Gothami Balika Vidyalaya, Colombo">Gothami Balika Vidyalaya, Colombo</SelectItem>
                    <SelectItem value="Gurukula College, Kelaniya">Gurukula College, Kelaniya</SelectItem>
                    <SelectItem value="Hameed Al Husseinie College">Hameed Al Husseinie College</SelectItem>
                    <SelectItem value="Hanwella Rajasinghe Central College">Hanwella Rajasinghe Central College</SelectItem>
                    <SelectItem value="Harischandra College">Harischandra College</SelectItem>
                    <SelectItem value="Henegama Central College - National School, Henegama">Henegama Central College - National School, Henegama</SelectItem>
                    <SelectItem value="Hindu College, Colombo">Hindu College, Colombo</SelectItem>
                    <SelectItem value="Isipathana College, Colombo">Isipathana College, Colombo</SelectItem>
                    <SelectItem value="Kelani Maha Vidyalaya">Kelani Maha Vidyalaya</SelectItem>
                    <SelectItem value="Kolonnawa Girl's College">Kolonnawa Girl's College</SelectItem>
                    <SelectItem value="Kotahena Central College">Kotahena Central College</SelectItem>
                    <SelectItem value="Lumbini College, Colombo">Lumbini College, Colombo</SelectItem>
                    <SelectItem value="Mahanama College, Colombo">Mahanama College, Colombo</SelectItem>
                    <SelectItem value="Mahinda Rajapaksha Vidyalaya, Homagama">Mahinda Rajapaksha Vidyalaya, Homagama</SelectItem>
                    <SelectItem value="Muslim Ladies College, Colombo">Muslim Ladies College, Colombo</SelectItem>
                    <SelectItem value="Nalanda College, Colombo">Nalanda College, Colombo</SelectItem>
                    <SelectItem value="Nalanda (Boys') Central College, Minuwangoda">Nalanda (Boys') Central College, Minuwangoda</SelectItem>
                    <SelectItem value="Nalanda (Girls') Central College, Minuwangoda">Nalanda (Girls') Central College, Minuwangoda</SelectItem>
                    <SelectItem value="Newstead Girls College, Negombo">Newstead Girls College, Negombo</SelectItem>
                    <SelectItem value="Piliyandala Central College">Piliyandala Central College</SelectItem>
                    <SelectItem value="Presbyterian Girls' School Dehiwala">Presbyterian Girls' School Dehiwala</SelectItem>
                    <SelectItem value="President's College">President's College</SelectItem>
                    <SelectItem value="President's College, Minuwangoda">President's College, Minuwangoda</SelectItem>
                    <SelectItem value="Prince of Wales' College, Moratuwa">Prince of Wales' College, Moratuwa</SelectItem>
                    <SelectItem value="Princess of Wales' College">Princess of Wales' College</SelectItem>
                    <SelectItem value="Ramanathan Hindu Ladies College, Colombo">Ramanathan Hindu Ladies College, Colombo</SelectItem>
                    <SelectItem value="Rathnavali Balika MV, Gampaha">Rathnavali Balika MV, Gampaha</SelectItem>
                    <SelectItem value="Royal College, Colombo">Royal College, Colombo</SelectItem>
                    <SelectItem value="Science College, Mount Lavinia">Science College, Mount Lavinia</SelectItem>
                    <SelectItem value="Seethawaka National School">Seethawaka National School</SelectItem>
                    <SelectItem value="Sirimavo Bandaranaike Balika Vidyalaya, Colombo">Sirimavo Bandaranaike Balika Vidyalaya, Colombo</SelectItem>
                    <SelectItem value="Siyane National School">Siyane National School</SelectItem>
                    <SelectItem value="Sri Dharmaloka College">Sri Dharmaloka College</SelectItem>
                    <SelectItem value="Sri Sangabodhi National College">Sri Sangabodhi National College</SelectItem>
                    <SelectItem value="SRI RAJASINGHE CENTRAL, MULLERIYAWA">SRI RAJASINGHE CENTRAL, MULLERIYAWA</SelectItem>
                    <SelectItem value="SRI Subhuthi National school">SRI Subhuthi National school</SelectItem>
                    <SelectItem value="St Anthony's College, Wattala">St Anthony's College, Wattala</SelectItem>
                    <SelectItem value="St Paul's Girls School, Colombo">St Paul's Girls School, Colombo</SelectItem>
                    <SelectItem value="St. Paul's Balika Maha Vidyalaya, Kelaniya">St. Paul's Balika Maha Vidyalaya, Kelaniya</SelectItem>
                    <SelectItem value="Thakshila College Gampaha">Thakshila College Gampaha</SelectItem>
                    <SelectItem value="Thurston College, Colombo">Thurston College, Colombo</SelectItem>
                    <SelectItem value="Vihara Maha Devi Balika Vidyalaya, Kiribathgoda">Vihara Maha Devi Balika Vidyalaya, Kiribathgoda</SelectItem>
                    <SelectItem value="Visakha Vidyalaya, Colombo">Visakha Vidyalaya, Colombo</SelectItem>
                    <SelectItem value="Yashodara Devi Balika Maha Vidyalaya - Gampaha">Yashodara Devi Balika Maha Vidyalaya - Gampaha</SelectItem>
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
