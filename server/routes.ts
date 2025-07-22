import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertMemberProfileSchema, insertForumPostSchema, insertForumReplySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Initialize forum categories
  const categories = await storage.getForumCategories();
  if (categories.length === 0) {
    await storage.createForumCategory({
      name: "💡 Ideas & Feedback",
      description: "Share your startup ideas and get feedback from the community",
      icon: "💡",
      color: "#3B82F6"
    });
    await storage.createForumCategory({
      name: "🚀 Startup Stories",
      description: "Share your entrepreneurial journey and milestones",
      icon: "🚀",
      color: "#10B981"
    });
    await storage.createForumCategory({
      name: "💰 Fundraising",
      description: "Discuss fundraising strategies, investor relations, and funding rounds",
      icon: "💰",
      color: "#F59E0B"
    });
    await storage.createForumCategory({
      name: "🤝 Co-founder Search",
      description: "Find your next co-founder or team member",
      icon: "🤝",
      color: "#8B5CF6"
    });
    await storage.createForumCategory({
      name: "⚙️ Tech & Product",
      description: "Technical discussions, product development, and best practices",
      icon: "⚙️",
      color: "#6B7280"
    });
  }

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const profile = await storage.getMemberProfile(userId);
      res.json({ ...user, profile });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Member profile routes
  app.post('/api/profiles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertMemberProfileSchema.parse({
        ...req.body,
        userId
      });
      
      const existingProfile = await storage.getMemberProfile(userId);
      if (existingProfile) {
        const updatedProfile = await storage.updateMemberProfile(userId, profileData);
        res.json(updatedProfile);
      } else {
        const newProfile = await storage.createMemberProfile(profileData);
        res.json(newProfile);
      }
    } catch (error) {
      console.error("Error creating/updating profile:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save profile" });
      }
    }
  });

  app.get('/api/profiles', async (req, res) => {
    try {
      const { search } = req.query;
      let profiles;
      
      if (search && typeof search === 'string') {
        profiles = await storage.searchMemberProfiles(search);
      } else {
        profiles = await storage.getAllMemberProfiles();
      }
      
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });

  // Forum routes
  app.get('/api/forum/categories', async (req, res) => {
    try {
      const categories = await storage.getForumCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get('/api/forum/posts', async (req, res) => {
    try {
      const { categoryId } = req.query;
      const posts = await storage.getForumPosts(
        categoryId ? parseInt(categoryId as string) : undefined
      );
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post('/api/forum/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postData = insertForumPostSchema.parse({
        ...req.body,
        userId
      });
      
      const newPost = await storage.createForumPost(postData);
      res.json(newPost);
    } catch (error) {
      console.error("Error creating post:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid post data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create post" });
      }
    }
  });

  app.get('/api/forum/posts/:id', async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getForumPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.get('/api/forum/posts/:id/replies', async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const replies = await storage.getForumReplies(postId);
      res.json(replies);
    } catch (error) {
      console.error("Error fetching replies:", error);
      res.status(500).json({ message: "Failed to fetch replies" });
    }
  });

  app.post('/api/forum/posts/:id/replies', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      const replyData = insertForumReplySchema.parse({
        ...req.body,
        userId,
        postId
      });
      
      const newReply = await storage.createForumReply(replyData);
      res.json(newReply);
    } catch (error) {
      console.error("Error creating reply:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid reply data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create reply" });
      }
    }
  });

  app.post('/api/forum/posts/:id/like', isAuthenticated, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      await storage.likeForumPost(postId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  app.post('/api/forum/replies/:id/like', isAuthenticated, async (req, res) => {
    try {
      const replyId = parseInt(req.params.id);
      await storage.likeForumReply(replyId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error liking reply:", error);
      res.status(500).json({ message: "Failed to like reply" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
