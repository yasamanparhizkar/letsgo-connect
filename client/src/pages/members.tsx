import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import MemberCard from "@/components/member-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";

export default function Members() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: profiles, isLoading } = useQuery({
    queryKey: ["/api/profiles", searchQuery && { search: searchQuery }],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Query will automatically refetch due to queryKey dependency
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-black text-elegant-white">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
            <p className="text-gray-300">Loading members...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black text-elegant-white">
      <Navigation />
      
      <div className="pt-16">
        {/* Header Section */}
        <section className="py-12 hero-gradient">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-6xl font-bold font-playfair mb-6">
              Meet Our <span className="text-gradient">Founders</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Connect with amazing entrepreneurs from diverse backgrounds and industries.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
              <Input 
                type="text" 
                placeholder="Search founders by name, industry, or expertise..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-dark-gray border border-gray-600 rounded-xl text-elegant-white placeholder-gray-400 focus:border-accent-blue focus:outline-none transition-colors duration-200"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </form>
          </div>
        </section>

        {/* Members Grid */}
        <section className="py-12 bg-charcoal">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">
                {profiles?.length || 0} Members Found
              </h2>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-dark-gray">
                <Filter className="mr-2" size={16} />
                Filters
              </Button>
            </div>

            {profiles && profiles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile: any) => (
                  <MemberCard key={profile.id} member={profile} />
                ))}
              </div>
            ) : (
              <Card className="bg-dark-gray border-gray-600">
                <CardContent className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    {searchQuery ? (
                      <>
                        <Search className="mx-auto mb-4" size={48} />
                        <h3 className="text-xl font-semibold mb-2">No members found</h3>
                        <p>Try adjusting your search terms or browse all members.</p>
                        <Button 
                          className="mt-4"
                          onClick={() => setSearchQuery("")}
                          variant="outline"
                        >
                          Clear Search
                        </Button>
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold mb-2">No members yet</h3>
                        <p>Be the first to create a profile and join the community!</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-deep-black">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-playfair mb-4">
                Community <span className="text-gradient">Stats</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-dark-gray border-gray-600">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-gradient">{profiles?.length || 0}</div>
                  <div className="text-gray-400">Total Members</div>
                </CardContent>
              </Card>
              
              <Card className="bg-dark-gray border-gray-600">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-gradient">25+</div>
                  <div className="text-gray-400">Industries</div>
                </CardContent>
              </Card>
              
              <Card className="bg-dark-gray border-gray-600">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-gradient">15+</div>
                  <div className="text-gray-400">Countries</div>
                </CardContent>
              </Card>
              
              <Card className="bg-dark-gray border-gray-600">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-gradient">$500M+</div>
                  <div className="text-gray-400">Funds Raised</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
