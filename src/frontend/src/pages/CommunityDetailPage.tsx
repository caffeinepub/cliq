import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Send, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CommunityPost {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
}

const MOCK_POSTS: CommunityPost[] = [
  {
    id: "1",
    author: "Ada Obi",
    content:
      "Anyone else working on the ML project for next semester? Would love to collaborate!",
    timestamp: new Date(Date.now() - 3600000),
    likes: 12,
  },
  {
    id: "2",
    author: "Tunde Akin",
    content:
      "Great hackathon last weekend! Huge shoutout to everyone who participated 🚀",
    timestamp: new Date(Date.now() - 7200000),
    likes: 34,
  },
  {
    id: "3",
    author: "Chioma Nze",
    content:
      "Free Python workshop this Saturday at the CS lab. All levels welcome! Drop a 👋 if you are coming",
    timestamp: new Date(Date.now() - 86400000),
    likes: 56,
  },
];

const MOCK_MEMBERS = [
  "Ada Obi",
  "Tunde Akin",
  "Chioma Nze",
  "Emeka Eze",
  "Fatima Bello",
  "Sola Adeyemi",
  "Kene Ogu",
  "Bisi Lawal",
];

export function CommunityDetailPage() {
  useParams({ from: "/communities/$communityId" });
  const navigate = useNavigate();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [newPost, setNewPost] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const handlePost = () => {
    if (!newPost.trim()) return;
    setPosts((prev) => [
      {
        id: Date.now().toString(),
        author: "You",
        content: newPost,
        timestamp: new Date(),
        likes: 0,
      },
      ...prev,
    ]);
    setNewPost("");
    toast.success("Post shared!");
  };

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b-2 p-4 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/communities" })}
            data-ocid="community.back_button"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
            💻
          </div>
          <div>
            <h1 className="font-black text-lg">UNILAG Tech Hub</h1>
            <p className="text-xs text-muted-foreground">234 members</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full grid grid-cols-2 h-11 rounded-none border-b-2">
          <TabsTrigger value="posts" data-ocid="community.posts.tab">
            Posts
          </TabsTrigger>
          <TabsTrigger value="members" data-ocid="community.members.tab">
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="p-4 space-y-4">
          {/* Post composer */}
          <Card className="border-2">
            <CardContent className="p-4 space-y-3">
              <Textarea
                placeholder="Share something with this community..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="resize-none border-0 p-0 focus-visible:ring-0 text-sm"
                rows={3}
                data-ocid="community.textarea"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  className="rounded-full gap-2"
                  onClick={handlePost}
                  data-ocid="community.submit_button"
                >
                  <Send className="h-4 w-4" /> Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {posts.map((post, i) => (
            <Card
              key={post.id}
              className="border-2"
              data-ocid={`community.item.${i + 1}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-sm">{post.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {post.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm">{post.content}</p>
                <div className="mt-3 flex gap-4">
                  <button
                    type="button"
                    className={`text-xs font-semibold transition-colors ${likedPosts.has(post.id) ? "text-primary" : "text-muted-foreground"}`}
                    onClick={() => handleLike(post.id)}
                    data-ocid={`community.post.toggle.${i + 1}`}
                  >
                    ❤️ {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="members" className="p-4">
          <div className="space-y-3">
            {MOCK_MEMBERS.map((member, i) => (
              <div
                key={member}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                data-ocid={`community.member.item.${i + 1}`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="font-bold bg-primary/10 text-primary">
                    {member
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-sm">{member}</span>
                {i === 0 && <Badge className="ml-auto text-xs">Admin</Badge>}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
