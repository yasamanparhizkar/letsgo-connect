import {
  users,
  memberProfiles,
  forumCategories,
  forumPosts,
  forumReplies,
  chatMessages,
  type User,
  type InsertUser,
  type MemberProfile,
  type InsertMemberProfile,
  type ForumCategory,
  type ForumPost,
  type InsertForumPost,
  type ForumReply,
  type InsertForumReply,
  type ChatMessage,
  type InsertChatMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, ilike, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations for username/password auth
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Member profile operations
  getMemberProfile(userId: number): Promise<MemberProfile | undefined>;
  createMemberProfile(profile: InsertMemberProfile): Promise<MemberProfile>;
  updateMemberProfile(userId: number, profile: Partial<InsertMemberProfile>): Promise<MemberProfile | undefined>;
  getAllMemberProfiles(): Promise<(MemberProfile & { user: User })[]>;
  searchMemberProfiles(query: string): Promise<(MemberProfile & { user: User })[]>;
  
  // Forum operations
  getForumCategories(): Promise<ForumCategory[]>;
  createForumCategory(category: { name: string; description?: string; icon?: string; color?: string }): Promise<ForumCategory>;
  getForumPosts(categoryId?: number): Promise<(ForumPost & { user: User; category?: ForumCategory })[]>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  getForumPost(id: number): Promise<(ForumPost & { user: User; category?: ForumCategory }) | undefined>;
  getForumReplies(postId: number): Promise<(ForumReply & { user: User })[]>;
  createForumReply(reply: InsertForumReply): Promise<ForumReply>;
  likeForumPost(postId: number): Promise<void>;
  likeForumReply(replyId: number): Promise<void>;
  
  // Chat operations
  getChatMessages(): Promise<{ id: number; userId: number; username: string; firstName?: string; lastName?: string; profileImageUrl?: string; message: string; timestamp: string }[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessageWithUser(id: number): Promise<ChatMessage & { user: User }>;
}

export class DatabaseStorage implements IStorage {
  // User operations for username/password auth
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // Member profile operations
  async getMemberProfile(userId: number): Promise<MemberProfile | undefined> {
    const [profile] = await db
      .select()
      .from(memberProfiles)
      .where(eq(memberProfiles.userId, userId));
    return profile;
  }

  async createMemberProfile(profile: InsertMemberProfile): Promise<MemberProfile> {
    const [newProfile] = await db
      .insert(memberProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateMemberProfile(userId: number, profile: Partial<InsertMemberProfile>): Promise<MemberProfile | undefined> {
    const [updatedProfile] = await db
      .update(memberProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(memberProfiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  async getAllMemberProfiles(): Promise<(MemberProfile & { user: User })[]> {
    const profiles = await db
      .select({
        id: memberProfiles.id,
        userId: memberProfiles.userId,
        title: memberProfiles.title,
        bio: memberProfiles.bio,
        company: memberProfiles.company,
        industry: memberProfiles.industry,
        stage: memberProfiles.stage,
        location: memberProfiles.location,
        website: memberProfiles.website,
        linkedin: memberProfiles.linkedin,
        twitter: memberProfiles.twitter,
        lookingFor: memberProfiles.lookingFor,
        skills: memberProfiles.skills,
        isActive: memberProfiles.isActive,
        createdAt: memberProfiles.createdAt,
        updatedAt: memberProfiles.updatedAt,
        user: users,
      })
      .from(memberProfiles)
      .leftJoin(users, eq(memberProfiles.userId, users.id))
      .where(eq(memberProfiles.isActive, true))
      .orderBy(desc(memberProfiles.createdAt));
    
    return profiles;
  }

  async searchMemberProfiles(query: string): Promise<(MemberProfile & { user: User })[]> {
    const profiles = await db
      .select({
        id: memberProfiles.id,
        userId: memberProfiles.userId,
        title: memberProfiles.title,
        bio: memberProfiles.bio,
        company: memberProfiles.company,
        industry: memberProfiles.industry,
        stage: memberProfiles.stage,
        location: memberProfiles.location,
        website: memberProfiles.website,
        linkedin: memberProfiles.linkedin,
        twitter: memberProfiles.twitter,
        lookingFor: memberProfiles.lookingFor,
        skills: memberProfiles.skills,
        isActive: memberProfiles.isActive,
        createdAt: memberProfiles.createdAt,
        updatedAt: memberProfiles.updatedAt,
        user: users,
      })
      .from(memberProfiles)
      .leftJoin(users, eq(memberProfiles.userId, users.id))
      .where(
        sql`${memberProfiles.isActive} = true AND (
          ${memberProfiles.title} ILIKE ${`%${query}%`} OR
          ${memberProfiles.bio} ILIKE ${`%${query}%`} OR
          ${memberProfiles.company} ILIKE ${`%${query}%`} OR
          ${memberProfiles.industry} ILIKE ${`%${query}%`} OR
          ${users.firstName} ILIKE ${`%${query}%`} OR
          ${users.lastName} ILIKE ${`%${query}%`}
        )`
      )
      .orderBy(desc(memberProfiles.createdAt));
    
    return profiles;
  }

  // Forum operations
  async getForumCategories(): Promise<ForumCategory[]> {
    return await db.select().from(forumCategories).orderBy(asc(forumCategories.name));
  }

  async createForumCategory(category: { name: string; description?: string; icon?: string; color?: string }): Promise<ForumCategory> {
    const [newCategory] = await db
      .insert(forumCategories)
      .values(category)
      .returning();
    return newCategory;
  }

  async getForumPosts(categoryId?: number): Promise<(ForumPost & { user: User; category?: ForumCategory })[]> {
    let query = db
      .select({
        id: forumPosts.id,
        userId: forumPosts.userId,
        categoryId: forumPosts.categoryId,
        title: forumPosts.title,
        content: forumPosts.content,
        likes: forumPosts.likes,
        replyCount: forumPosts.replyCount,
        createdAt: forumPosts.createdAt,
        updatedAt: forumPosts.updatedAt,
        user: users,
        category: forumCategories,
      })
      .from(forumPosts)
      .leftJoin(users, eq(forumPosts.userId, users.id))
      .leftJoin(forumCategories, eq(forumPosts.categoryId, forumCategories.id));

    if (categoryId) {
      query = query.where(eq(forumPosts.categoryId, categoryId));
    }

    return await query.orderBy(desc(forumPosts.createdAt));
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [newPost] = await db
      .insert(forumPosts)
      .values(post)
      .returning();
    return newPost;
  }

  async getForumPost(id: number): Promise<(ForumPost & { user: User; category?: ForumCategory }) | undefined> {
    const [post] = await db
      .select({
        id: forumPosts.id,
        userId: forumPosts.userId,
        categoryId: forumPosts.categoryId,
        title: forumPosts.title,
        content: forumPosts.content,
        likes: forumPosts.likes,
        replyCount: forumPosts.replyCount,
        createdAt: forumPosts.createdAt,
        updatedAt: forumPosts.updatedAt,
        user: users,
        category: forumCategories,
      })
      .from(forumPosts)
      .leftJoin(users, eq(forumPosts.userId, users.id))
      .leftJoin(forumCategories, eq(forumPosts.categoryId, forumCategories.id))
      .where(eq(forumPosts.id, id));
    return post;
  }

  async getForumReplies(postId: number): Promise<(ForumReply & { user: User })[]> {
    const replies = await db
      .select({
        id: forumReplies.id,
        postId: forumReplies.postId,
        userId: forumReplies.userId,
        content: forumReplies.content,
        likes: forumReplies.likes,
        createdAt: forumReplies.createdAt,
        updatedAt: forumReplies.updatedAt,
        user: users,
      })
      .from(forumReplies)
      .leftJoin(users, eq(forumReplies.userId, users.id))
      .where(eq(forumReplies.postId, postId))
      .orderBy(asc(forumReplies.createdAt));
    
    return replies;
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    const [newReply] = await db
      .insert(forumReplies)
      .values(reply)
      .returning();
    
    // Update reply count
    await db
      .update(forumPosts)
      .set({ 
        replyCount: sql`${forumPosts.replyCount} + 1` 
      })
      .where(eq(forumPosts.id, reply.postId));
    
    return newReply;
  }

  async likeForumPost(postId: number): Promise<void> {
    await db
      .update(forumPosts)
      .set({ 
        likes: sql`${forumPosts.likes} + 1` 
      })
      .where(eq(forumPosts.id, postId));
  }

  async likeForumReply(replyId: number): Promise<void> {
    await db
      .update(forumReplies)
      .set({ 
        likes: sql`${forumReplies.likes} + 1` 
      })
      .where(eq(forumReplies.id, replyId));
  }

  // Chat operations
  async getChatMessages(): Promise<{ id: number; userId: number; username: string; firstName?: string; lastName?: string; profileImageUrl?: string; message: string; timestamp: string }[]> {
    const messages = await db
      .select({
        id: chatMessages.id,
        userId: chatMessages.userId,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        message: chatMessages.message,
        timestamp: chatMessages.createdAt,
      })
      .from(chatMessages)
      .innerJoin(users, eq(chatMessages.userId, users.id))
      .orderBy(asc(chatMessages.createdAt))
      .limit(100);

    return messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp.toISOString()
    }));
  }

  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(messageData)
      .returning();
    return message;
  }

  async getChatMessageWithUser(id: number): Promise<ChatMessage & { user: User }> {
    const [result] = await db
      .select({
        id: chatMessages.id,
        userId: chatMessages.userId,
        message: chatMessages.message,
        createdAt: chatMessages.createdAt,
        user: users,
      })
      .from(chatMessages)
      .innerJoin(users, eq(chatMessages.userId, users.id))
      .where(eq(chatMessages.id, id));

    return result;
  }
}

export const storage = new DatabaseStorage();
