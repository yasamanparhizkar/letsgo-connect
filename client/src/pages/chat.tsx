import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Users } from "lucide-react";
import Navigation from "@/components/navigation";

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  message: string;
  timestamp: string;
}

interface OnlineUser {
  userId: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end",
        inline: "nearest"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) return;

    // Create WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    wsRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      // Join the chat room
      socket.send(JSON.stringify({
        type: 'join',
        user: {
          userId: user.id.toString(),
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName
        }
      }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'chatHistory':
          setMessages(data.messages.map((msg: any) => ({
            id: msg.id.toString(),
            userId: msg.userId.toString(),
            username: msg.username,
            firstName: msg.firstName,
            lastName: msg.lastName,
            profileImageUrl: msg.profileImageUrl,
            message: msg.message,
            timestamp: msg.timestamp
          })));
          break;
        case 'message':
          setMessages(prev => [...prev, data.message]);
          break;
        case 'userJoined':
          setOnlineUsers(prev => [...prev.filter(u => u.userId !== data.user.userId), data.user]);
          break;
        case 'userLeft':
          setOnlineUsers(prev => prev.filter(u => u.userId !== data.userId));
          break;
        case 'onlineUsers':
          setOnlineUsers(data.users);
          break;
        case 'error':
          console.error('Chat error:', data.message);
          break;
      }
    };

    socket.onclose = () => {
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [user]);

  const sendMessage = () => {
    if (!newMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    wsRef.current.send(JSON.stringify({
      type: 'sendMessage',
      message: newMessage.trim()
    }));

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getDisplayName = (msg: ChatMessage) => {
    if (msg.firstName && msg.lastName) {
      return `${msg.firstName} ${msg.lastName}`;
    }
    return msg.username;
  };

  const getInitials = (msg: ChatMessage) => {
    if (msg.firstName && msg.lastName) {
      return `${msg.firstName[0]}${msg.lastName[0]}`.toUpperCase();
    }
    return msg.username.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-deep-black text-elegant-white">
      <Navigation />
      
      <div className="pt-16 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-12rem)]">
          {/* Online Users Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-full bg-rich-gray border-accent-blue/20 p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-accent-blue" />
                <h3 className="font-semibold text-elegant-white">Online Now</h3>
                <Badge variant="secondary" className="bg-accent-blue/10 text-accent-blue">
                  {onlineUsers.length}
                </Badge>
              </div>
              <ScrollArea className="h-[calc(100%-4rem)]">
                <div className="space-y-2">
                  {onlineUsers.map((user) => (
                    <div key={user.userId} className="flex items-center space-x-3 p-2 rounded-lg bg-soft-gray/30">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-elegant-white truncate">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.username
                          }
                        </p>
                        {user.firstName && user.lastName && (
                          <p className="text-xs text-gray-400 truncate">@{user.username}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full bg-rich-gray border-accent-blue/20 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-accent-blue/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-elegant-white">Live Chat</h2>
                    <p className="text-sm text-gray-400">
                      Connect with fellow founders in real-time
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-gray-400">
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0 overflow-y-auto p-4 scroll-smooth">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="flex space-x-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={message.profileImageUrl} />
                          <AvatarFallback className="bg-accent-blue/10 text-accent-blue text-xs">
                            {getInitials(message)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline space-x-2">
                            <p className="text-sm font-medium text-elegant-white">
                              {getDisplayName(message)}
                            </p>
                            <span className="text-xs text-gray-400">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mt-1 break-words">
                            {message.message}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} className="h-1" />
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-accent-blue/20">
                <div className="flex space-x-3">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-800 border-accent-blue/20 text-white placeholder-gray-400 focus:bg-gray-700"
                    disabled={!isConnected}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || !isConnected}
                    className="bg-accent-blue hover:bg-accent-blue/80 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}