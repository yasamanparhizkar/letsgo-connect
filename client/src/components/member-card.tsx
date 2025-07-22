import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Building, Globe, Linkedin, Twitter } from "lucide-react";

interface MemberCardProps {
  member: {
    id: number;
    userId: string;
    title?: string;
    bio?: string;
    company?: string;
    industry?: string;
    stage?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
    skills?: string[];
    user: {
      firstName?: string;
      lastName?: string;
      email?: string;
      profileImageUrl?: string;
    };
  };
  compact?: boolean;
}

export default function MemberCard({ member, compact = false }: MemberCardProps) {
  const { user } = member;
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  
  // Determine activity status (placeholder logic)
  const activityStatuses = ["Active", "Busy", "Away"];
  const randomStatus = activityStatuses[Math.floor(Math.random() * activityStatuses.length)];
  const statusColors = {
    Active: "bg-success-green",
    Busy: "bg-yellow-400",
    Away: "bg-gray-500"
  };
  const statusTextColors = {
    Active: "text-success-green",
    Busy: "text-yellow-400",
    Away: "text-gray-400"
  };

  if (compact) {
    return (
      <Card className="bg-dark-gray border-gray-600 hover:bg-opacity-80 transition-all duration-300 cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.profileImageUrl} alt={fullName} />
              <AvatarFallback className="bg-charcoal text-elegant-white">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold truncate">{fullName}</h3>
              <p className="text-gray-400 text-sm truncate">{member.title}</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className={`w-2 h-2 ${statusColors[randomStatus as keyof typeof statusColors]} rounded-full`}></div>
                <span className={`text-xs ${statusTextColors[randomStatus as keyof typeof statusTextColors]}`}>{randomStatus}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-dark-gray border-gray-600 hover:bg-opacity-80 transition-all duration-300 group cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.profileImageUrl} alt={fullName} />
            <AvatarFallback className="bg-charcoal text-elegant-white text-lg">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold">{fullName}</h3>
            <p className="text-gray-400">{member.title}</p>
            <div className="flex items-center space-x-1 mt-1">
              <div className={`w-2 h-2 ${statusColors[randomStatus as keyof typeof statusColors]} rounded-full`}></div>
              <span className={`text-xs ${statusTextColors[randomStatus as keyof typeof statusTextColors]}`}>{randomStatus}</span>
            </div>
          </div>
        </div>
        
        {member.bio && (
          <p className="text-gray-300 text-sm mb-4 line-clamp-3">{member.bio}</p>
        )}
        
        {/* Company and Location */}
        <div className="space-y-2 mb-4">
          {member.company && (
            <div className="flex items-center text-gray-400 text-sm">
              <Building className="mr-2" size={14} />
              {member.company}
            </div>
          )}
          {member.location && (
            <div className="flex items-center text-gray-400 text-sm">
              <MapPin className="mr-2" size={14} />
              {member.location}
            </div>
          )}
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {member.industry && (
            <Badge className="bg-accent-blue bg-opacity-20 text-accent-blue text-xs">
              {member.industry}
            </Badge>
          )}
          {member.stage && (
            <Badge className="bg-success-green bg-opacity-20 text-success-green text-xs">
              {member.stage}
            </Badge>
          )}
          {member.skills?.slice(0, 2).map((skill, index) => (
            <Badge key={index} className="bg-purple-500 bg-opacity-20 text-purple-400 text-xs">
              {skill}
            </Badge>
          ))}
        </div>
        
        {/* Social Links */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {member.website && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="p-2 h-8 w-8 text-gray-400 hover:text-accent-blue"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(member.website?.startsWith('http') ? member.website : `https://${member.website}`, '_blank');
                }}
              >
                <Globe size={14} />
              </Button>
            )}
            {member.linkedin && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="p-2 h-8 w-8 text-gray-400 hover:text-accent-blue"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(member.linkedin?.startsWith('http') ? member.linkedin : `https://linkedin.com/in/${member.linkedin}`, '_blank');
                }}
              >
                <Linkedin size={14} />
              </Button>
            )}
            {member.twitter && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="p-2 h-8 w-8 text-gray-400 hover:text-accent-blue"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(member.twitter?.startsWith('http') ? member.twitter : `https://twitter.com/${member.twitter}`, '_blank');
                }}
              >
                <Twitter size={14} />
              </Button>
            )}
          </div>
          
          <Button 
            size="sm" 
            className="bg-accent-blue hover:bg-blue-600 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement connect functionality
            }}
          >
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
