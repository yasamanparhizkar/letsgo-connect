import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import CreateProfileDialog from "@/components/create-profile-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, MapPin, Globe, Linkedin, Twitter, Building, Users } from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Fetch user's profile
  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ["/api/profiles"],
    enabled: !!user?.id, // Only fetch when user is loaded
  });

  // Find current user's profile
  const profile = Array.isArray(profiles) ? profiles.find((p: any) => p.userId === user?.id) : undefined;
  const hasProfile = !!profile;
  const isLoading = authLoading || profilesLoading;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
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
  }, [isAuthenticated, authLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-black text-elegant-white">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
            <p className="text-gray-300">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black text-elegant-white">
      <Navigation />
      
      <div className="pt-16">
        {hasProfile ? (
          <>
            {/* Header Section */}
            <section className="py-12 hero-gradient">
              <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                  <Avatar className="w-32 h-32 border-4 border-accent-blue">
                    <AvatarImage src={user?.profileImageUrl || ""} alt={`${user?.firstName} ${user?.lastName}`} />
                    <AvatarFallback className="bg-dark-gray text-elegant-white text-2xl">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h1 className="text-3xl lg:text-4xl font-bold font-playfair mb-2">
                          {user?.firstName} {user?.lastName}
                        </h1>
                        <p className="text-xl text-accent-blue mb-2">{profile.title}</p>
                        {profile.company && (
                          <div className="flex items-center text-gray-300 mb-2">
                            <Building className="mr-2" size={16} />
                            {profile.company}
                          </div>
                        )}
                        {profile.location && (
                          <div className="flex items-center text-gray-300">
                            <MapPin className="mr-2" size={16} />
                            {profile.location}
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        onClick={() => setShowEditProfile(true)}
                        className="bg-accent-blue hover:bg-blue-600"
                      >
                        <Edit className="mr-2" size={16} />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Profile Content */}
            <section className="py-12 bg-charcoal">
              <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-dark-gray border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-elegant-white">About</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 leading-relaxed">
                          {profile.bio || "No bio available."}
                        </p>
                      </CardContent>
                    </Card>

                    {profile.lookingFor && (
                      <Card className="bg-dark-gray border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-elegant-white">Looking For</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-300 leading-relaxed">
                            {profile.lookingFor}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {profile.skills && profile.skills.length > 0 && (
                      <Card className="bg-dark-gray border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-elegant-white">Skills & Expertise</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill: string, index: number) => (
                              <Badge key={index} variant="secondary" className="bg-accent-blue bg-opacity-20 text-accent-blue">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    <Card className="bg-dark-gray border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-elegant-white">Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {profile.industry && (
                          <div>
                            <h4 className="font-semibold text-gray-400 mb-1">Industry</h4>
                            <p className="text-elegant-white">{profile.industry}</p>
                          </div>
                        )}
                        
                        {profile.stage && (
                          <div>
                            <h4 className="font-semibold text-gray-400 mb-1">Stage</h4>
                            <Badge className="bg-success-green bg-opacity-20 text-success-green">
                              {profile.stage}
                            </Badge>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="font-semibold text-gray-400 mb-1">Member Since</h4>
                          <p className="text-elegant-white">
                            {new Date(user?.createdAt || '').toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long'
                            })}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-dark-gray border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-elegant-white">Connect</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {profile.website && (
                          <a 
                            href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-accent-blue hover:text-blue-400 transition-colors"
                          >
                            <Globe className="mr-2" size={16} />
                            Website
                          </a>
                        )}
                        
                        {profile.linkedin && (
                          <a 
                            href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://linkedin.com/in/${profile.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-accent-blue hover:text-blue-400 transition-colors"
                          >
                            <Linkedin className="mr-2" size={16} />
                            LinkedIn
                          </a>
                        )}
                        
                        {profile.twitter && (
                          <a 
                            href={profile.twitter.startsWith('http') ? profile.twitter : `https://twitter.com/${profile.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-accent-blue hover:text-blue-400 transition-colors"
                          >
                            <Twitter className="mr-2" size={16} />
                            Twitter
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="py-20 bg-charcoal min-h-[80vh] flex items-center">
            <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
              <div className="mb-8">
                <Avatar className="w-24 h-24 mx-auto mb-6 border-4 border-accent-blue">
                  <AvatarImage src={user?.profileImageUrl || ""} alt={`${user?.firstName} ${user?.lastName}`} />
                  <AvatarFallback className="bg-dark-gray text-elegant-white text-xl">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                
                <h1 className="text-3xl lg:text-4xl font-bold font-playfair mb-4">
                  Welcome, {user?.firstName}!
                </h1>
              </div>
              
              <Card className="bg-dark-gray border-accent-blue border-2">
                <CardContent className="p-8">
                  <Users className="mx-auto mb-4 text-accent-blue" size={48} />
                  <h2 className="text-2xl font-semibold mb-4">Complete Your Profile</h2>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Tell the Let's Go community about yourself, your startup, and what you're looking for. 
                    This helps other founders discover and connect with you.
                  </p>
                  <Button 
                    onClick={() => setShowEditProfile(true)}
                    size="lg"
                    className="bg-accent-blue hover:bg-blue-600"
                  >
                    Create Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </div>

      <CreateProfileDialog 
        open={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        profile={profile}
        isEditing={hasProfile}
      />
    </div>
  );
}
