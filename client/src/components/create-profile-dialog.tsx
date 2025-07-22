import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

const profileSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  company: z.string().optional(),
  industry: z.string().optional(),
  stage: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  lookingFor: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

type ProfileData = z.infer<typeof profileSchema>;

interface CreateProfileDialogProps {
  open: boolean;
  onClose: () => void;
  profile?: any;
  isEditing?: boolean;
}

export default function CreateProfileDialog({ 
  open, 
  onClose, 
  profile,
  isEditing = false 
}: CreateProfileDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [skillInput, setSkillInput] = useState("");

  const form = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      title: profile?.title || "",
      bio: profile?.bio || "",
      company: profile?.company || "",
      industry: profile?.industry || "",
      stage: profile?.stage || "",
      location: profile?.location || "",
      website: profile?.website || "",
      linkedin: profile?.linkedin || "",
      twitter: profile?.twitter || "",
      lookingFor: profile?.lookingFor || "",
      skills: profile?.skills || [],
    },
  });

  const profileMutation = useMutation({
    mutationFn: async (data: ProfileData) => {
      const response = await apiRequest("POST", "/api/profiles", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      onClose();
      toast({
        title: "Success",
        description: isEditing ? "Profile updated successfully!" : "Profile created successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} profile. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: ProfileData) => {
    profileMutation.mutate(data);
  };

  const addSkill = () => {
    if (skillInput.trim() && !form.getValues("skills")?.includes(skillInput.trim())) {
      const currentSkills = form.getValues("skills") || [];
      form.setValue("skills", [...currentSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues("skills") || [];
    form.setValue("skills", currentSkills.filter(skill => skill !== skillToRemove));
  };

  const industries = [
    "AI/ML", "Fintech", "Healthcare", "E-commerce", "SaaS", "Climate Tech", 
    "EdTech", "PropTech", "FoodTech", "Gaming", "Social Media", "Cybersecurity",
    "Blockchain", "IoT", "Biotech", "AgTech", "Consumer Goods", "Enterprise Software"
  ];

  const stages = [
    "Idea", "Pre-Seed", "Seed", "Series A", "Series B", "Series C+", "IPO", "Acquired"
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-dark-gray border-gray-600 text-elegant-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? "Edit Profile" : "Create Your Profile"}
          </DialogTitle>
          <p className="text-gray-300">
            {isEditing 
              ? "Update your information to keep the community informed about your journey."
              : "Tell the Let's Go community about yourself and what you're building."
            }
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g. AI/ML Startup Founder"
                        className="bg-charcoal border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Your startup or company name"
                        className="bg-charcoal border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio *</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Tell us about yourself, your background, and what you're working on..."
                      className="bg-charcoal border-gray-600 min-h-24"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-charcoal border-gray-600">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-dark-gray border-gray-600">
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-charcoal border-gray-600">
                          <SelectValue placeholder="Select your startup stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-dark-gray border-gray-600">
                        {stages.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g. San Francisco, CA"
                        className="bg-charcoal border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="https://yourcompany.com"
                        className="bg-charcoal border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="linkedin.com/in/yourprofile or username"
                        className="bg-charcoal border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="@username or full URL"
                        className="bg-charcoal border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="lookingFor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What are you looking for?</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="e.g. Co-founder, investors, advisors, team members, beta users..."
                      className="bg-charcoal border-gray-600 min-h-20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills & Expertise</FormLabel>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input 
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add a skill..."
                        className="bg-charcoal border-gray-600"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        onClick={addSkill}
                        className="bg-accent-blue hover:bg-blue-600"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    {field.value && field.value.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((skill, index) => (
                          <div 
                            key={index}
                            className="bg-accent-blue bg-opacity-20 text-accent-blue px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="hover:text-red-400 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-600">
              <Button 
                type="button" 
                variant="outline"
                onClick={onClose}
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={profileMutation.isPending}
                className="bg-accent-blue hover:bg-blue-600"
              >
                {profileMutation.isPending 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Profile" : "Create Profile")
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
