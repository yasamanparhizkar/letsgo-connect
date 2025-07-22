import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import MemberCard from "@/components/member-card";

import CreateProfileDialog from "@/components/create-profile-dialog";
import { Users, MessageSquare, Calendar, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [showCreateProfile, setShowCreateProfile] = useState(false);

  const { data: profiles } = useQuery({
    queryKey: ["/api/profiles"],
  });

  // Find current user's profile
  const userProfile = Array.isArray(profiles) ? profiles.find((p: any) => p.userId === user?.id) : undefined;
  const needsProfile = !userProfile;

  return (
    <div className="min-h-screen bg-deep-black text-elegant-white">
      <Navigation />

      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-12 hero-gradient">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold font-playfair mb-6">
                Welcome back,{" "}
                <span className="text-gradient">
                  {user?.firstName || "Founder"}
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Your journey continues. Connect, share, and grow with the Let's
                Go community.
              </p>

              {needsProfile && (
                <Card className="max-w-2xl mx-auto mb-8 border-accent-blue border-2">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3">
                      Complete Your Profile
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Tell the community about yourself and what you're
                      building.
                    </p>
                    <Button
                      onClick={() => setShowCreateProfile(true)}
                      className="bg-accent-blue hover:bg-blue-600"
                    >
                      Create Profile
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-charcoal">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-dark-gray border-gray-600">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-accent-blue bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="text-accent-blue" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gradient">
                    {Array.isArray(profiles) ? profiles.length : 0}
                  </div>
                  <div className="text-gray-400">Active Members</div>
                </CardContent>
              </Card>

              <Card className="bg-dark-gray border-gray-600">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-success-green bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="text-success-green" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gradient">
                    Live
                  </div>
                  <div className="text-gray-400">Chat Room</div>
                </CardContent>
              </Card>

              <Card className="bg-dark-gray border-gray-600">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="text-purple-400" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gradient">0</div>
                  <div className="text-gray-400">Events This Month</div>
                </CardContent>
              </Card>

              <Card className="bg-dark-gray border-gray-600">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-500 bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="text-orange-400" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gradient">$0</div>
                  <div className="text-gray-400">Funds Raised</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="py-12 bg-deep-black">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Recent Members */}
              <div>
                <h2 className="text-3xl font-bold font-playfair mb-6 text-center">
                  New <span className="text-gradient">Members</span>
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.isArray(profiles) && 
                    profiles
                      .slice(0, 6)
                      .map((profile: any) => (
                        <MemberCard key={profile.id} member={profile} compact />
                      ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <CreateProfileDialog
        open={showCreateProfile}
        onClose={() => setShowCreateProfile(false)}
        profile={userProfile}
        isEditing={!!userProfile}
      />
    </div>
  );
}
