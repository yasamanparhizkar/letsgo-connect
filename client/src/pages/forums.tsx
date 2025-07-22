import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import ForumPost from "@/components/forum-post";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, MessageSquare } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

const createPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  categoryId: z.string().transform(Number),
});

type CreatePostData = z.infer<typeof createPostSchema>;

export default function Forums() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["/api/forum/categories"],
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/forum/posts", selectedCategory && { categoryId: selectedCategory }],
  });

  const form = useForm<CreatePostData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: CreatePostData) => {
      const response = await apiRequest("POST", "/api/forum/posts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      setShowCreatePost(false);
      form.reset();
      toast({
        title: "Success",
        description: "Your post has been created!",
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
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreatePost = (data: CreatePostData) => {
    createPostMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-black text-elegant-white">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
            <p className="text-gray-300">Loading discussions...</p>
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
              Community <span className="text-gradient">Forums</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join discussions, share insights, and get advice from experienced founders.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 bg-charcoal">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Categories Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <h3 className="text-xl font-semibold mb-6">Categories</h3>
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === null ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        selectedCategory === null
                          ? "bg-accent-blue text-white"
                          : "text-gray-300 hover:text-white hover:bg-dark-gray"
                      }`}
                      onClick={() => setSelectedCategory(null)}
                    >
                      All Categories
                    </Button>
                    {categories?.map((category: any) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "ghost"}
                        className={`w-full justify-start ${
                          selectedCategory === category.id
                            ? "bg-accent-blue text-white"
                            : "text-gray-300 hover:text-white hover:bg-dark-gray"
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.name.replace(/^[^\s]+\s/, "")}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Posts Area */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">
                    {selectedCategory 
                      ? categories?.find((c: any) => c.id === selectedCategory)?.name || "Category"
                      : "All Discussions"
                    }
                  </h3>
                  
                  {isAuthenticated ? (
                    <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
                      <DialogTrigger asChild>
                        <Button className="bg-accent-blue hover:bg-blue-600">
                          <Plus className="mr-2" size={16} />
                          New Post
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-dark-gray border-gray-600 text-elegant-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Create New Post</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handleCreatePost)} className="space-y-6">
                            <FormField
                              control={form.control}
                              name="categoryId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <Select onValueChange={field.onChange}>
                                    <FormControl>
                                      <SelectTrigger className="bg-charcoal border-gray-600">
                                        <SelectValue placeholder="Select a category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-dark-gray border-gray-600">
                                      {categories?.map((category: any) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                          {category.icon} {category.name}
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
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      placeholder="What's your discussion about?"
                                      className="bg-charcoal border-gray-600"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="content"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Content</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      {...field} 
                                      placeholder="Share your thoughts, questions, or insights..."
                                      className="bg-charcoal border-gray-600 min-h-32"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex justify-end space-x-3">
                              <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => setShowCreatePost(false)}
                                className="border-gray-600 text-gray-300"
                              >
                                Cancel
                              </Button>
                              <Button 
                                type="submit" 
                                disabled={createPostMutation.isPending}
                                className="bg-accent-blue hover:bg-blue-600"
                              >
                                {createPostMutation.isPending ? "Creating..." : "Create Post"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button onClick={() => window.location.href = "/api/login"} className="bg-accent-blue hover:bg-blue-600">
                      Sign In to Post
                    </Button>
                  )}
                </div>

                {posts && posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post: any) => (
                      <ForumPost key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <Card className="bg-dark-gray border-gray-600">
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
                      <h3 className="text-xl font-semibold mb-2 text-gray-300">No discussions yet</h3>
                      <p className="text-gray-400 mb-4">
                        {selectedCategory 
                          ? "No posts in this category yet. Be the first to start a discussion!"
                          : "No posts yet. Be the first to start a discussion!"
                        }
                      </p>
                      {isAuthenticated && (
                        <Button onClick={() => setShowCreatePost(true)} className="bg-accent-blue hover:bg-blue-600">
                          Start Discussion
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
