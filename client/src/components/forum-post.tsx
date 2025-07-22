import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface ForumPostProps {
  post: {
    id: number;
    userId: string;
    title: string;
    content: string;
    likes: number;
    replyCount: number;
    createdAt: string;
    user: {
      firstName?: string;
      lastName?: string;
      profileImageUrl?: string;
    };
    category?: {
      id: number;
      name: string;
      icon?: string;
      color?: string;
    };
  };
  compact?: boolean;
}

export default function ForumPost({ post, compact = false }: ForumPostProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [hasLiked, setHasLiked] = useState(false);
  
  const fullName = `${post.user.firstName || ""} ${post.user.lastName || ""}`.trim();
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/forum/posts/${post.id}/like`);
      return response.json();
    },
    onSuccess: () => {
      setHasLiked(true);
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
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
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    if (!hasLiked) {
      likeMutation.mutate();
    }
  };

  if (compact) {
    return (
      <Card className="bg-dark-gray border-gray-600 hover:bg-opacity-80 transition-all duration-200 cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.user.profileImageUrl} alt={fullName} />
              <AvatarFallback className="bg-charcoal text-elegant-white text-sm">
                {post.user.firstName?.[0]}{post.user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-lg truncate">{post.title}</h4>
              <p className="text-gray-300 text-sm line-clamp-2 mb-2">{post.content}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>By {fullName}</span>
                <span>{timeAgo}</span>
                <span className="flex items-center">
                  <MessageSquare className="mr-1" size={12} />
                  {post.replyCount}
                </span>
                <span className="flex items-center">
                  <Heart className="mr-1" size={12} />
                  {post.likes}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-dark-gray border-gray-600 hover:bg-opacity-80 transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={post.user.profileImageUrl} alt={fullName} />
            <AvatarFallback className="bg-charcoal text-elegant-white">
              {post.user.firstName?.[0]}{post.user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-lg">{post.title}</h4>
              {post.category && (
                <Badge className="bg-purple-500 bg-opacity-20 text-purple-400 text-xs">
                  {post.category.icon} {post.category.name}
                </Badge>
              )}
            </div>
            <p className="text-gray-300 mb-3 line-clamp-3">{post.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span className="flex items-center">
                  <Clock className="mr-1" size={14} />
                  By {fullName} • {timeAgo}
                </span>
                <span className="flex items-center">
                  <MessageSquare className="mr-1" size={14} />
                  {post.replyCount} replies
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={hasLiked || likeMutation.isPending}
                className={`flex items-center space-x-1 ${
                  hasLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                }`}
              >
                <Heart className={hasLiked ? 'fill-current' : ''} size={14} />
                <span>{post.likes}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
