# Let's Go - Founders Club Platform

## Overview

Let's Go is a full-stack web application built for entrepreneurs and founders to connect, collaborate, and share experiences. The platform serves as a social club inspired by SHACK15, providing member profiles, forum discussions, and community features. It's built with a modern TypeScript stack using React, Express, and PostgreSQL.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client-side and server-side code:

- **Frontend**: React-based SPA with TypeScript, built with Vite
- **Backend**: Express.js REST API with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth integration with session management
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Structure
- **Client Directory**: Contains the React application
- **UI Components**: Built with shadcn/ui and Radix UI primitives
- **Pages**: Landing, Home, About, Members, Forums, Profile
- **Hooks**: Custom hooks for authentication and utilities
- **Styling**: Tailwind CSS with custom dark theme variables

### Backend Structure
- **Server Directory**: Express.js application with TypeScript
- **Database Layer**: Drizzle ORM with connection pooling via Neon
- **Authentication**: Replit Auth with OpenID Connect
- **Storage Layer**: Abstracted database operations through storage interface
- **API Routes**: RESTful endpoints for users, profiles, and forum functionality

### Database Schema
- **Users**: Core user information (required for Replit Auth)
- **Sessions**: Session storage (required for Replit Auth)
- **Member Profiles**: Extended user profiles with bio, company, skills
- **Forum Categories**: Discussion categories with icons and colors
- **Forum Posts**: User-generated content with categorization
- **Forum Replies**: Threaded replies to posts with like functionality

## Data Flow

1. **Authentication Flow**: Users authenticate via Replit Auth, sessions stored in PostgreSQL
2. **Profile Management**: Extended profiles complement basic user data
3. **Forum System**: Hierarchical structure with categories, posts, and replies
4. **Real-time Updates**: Client-side state management with TanStack Query handles caching and updates
5. **API Communication**: RESTful endpoints with JSON payloads and proper error handling

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with hooks
- **Express**: Node.js web framework
- **TypeScript**: Static typing throughout the stack
- **Vite**: Frontend build tool and development server

### Database & ORM
- **PostgreSQL**: Primary database (via Neon serverless)
- **Drizzle ORM**: Type-safe database operations
- **connect-pg-simple**: Session store for PostgreSQL

### Authentication
- **Replit Auth**: OpenID Connect authentication
- **Passport.js**: Authentication middleware
- **express-session**: Session management

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library

### State Management
- **TanStack Query**: Server state management
- **React Hook Form**: Form state management
- **Zod**: Schema validation

## Deployment Strategy

The application is designed for deployment on Replit with the following characteristics:

- **Development**: Uses Vite dev server with HMR and Express API
- **Production**: Static build served by Express with API routes
- **Database**: Neon PostgreSQL with connection pooling
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, REPLIT_DOMAINS required
- **Build Process**: Frontend builds to dist/public, server bundles with esbuild
- **Session Storage**: PostgreSQL-backed sessions for scalability
- **Asset Serving**: Static assets served from Express in production

The architecture supports both development and production environments with proper error handling, logging, and performance optimizations including request timing and response compression.