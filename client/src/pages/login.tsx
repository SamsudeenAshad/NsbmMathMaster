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
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      <video
        src="/images/bg_video1.mp4"
        autoPlay
        loop
        muted
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
      />
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-br from-[#6366f1] to-[#3b82f6] text-white text-center mb-8 rounded-2xl p-6">
            <img src="/images/mathmaster.jpg" alt="NSBM MathsMaster Logo" className="h-20 mx-auto mb-4" />
            <h1 className="text-3xl font-bold">MathsMaster Competition</h1>
            <p className="text-gray-100 mt-2">NSBM Inter-School Mathematics Competition</p>
          </div>

          <Card className="bg-white rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-center mb-4 text-primary-700">Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">School</Label>
                  <Select value={formData.school} onValueChange={handleSchoolChange}>
                    <SelectTrigger className="bg-gray-100">
                      <SelectValue placeholder="Select your school" />
                    </SelectTrigger>
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
                </div>

                <div className="mb-4">
                  <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</Label>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="bg-gray-100"
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
                    className="bg-gray-100"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#6366f1] text-white"
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
    </div>
  );
}
