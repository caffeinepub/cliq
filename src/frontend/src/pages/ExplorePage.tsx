import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { PostComposer } from "../components/posts/PostComposer";
import { FloatingActionButton } from "../components/shared/FloatingActionButton";
import { UNIVERSITIES } from "../constants/universities";
import { useSearchUsers } from "../hooks/useQueries";

export function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [universityFilter, setUniversityFilter] = useState<string | null>(null);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);

  const { data: users, isLoading } = useSearchUsers(
    debouncedTerm,
    universityFilter,
  );

  const handleSearch = () => {
    setDebouncedTerm(searchTerm);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">Explore</h1>
        <p className="text-sm text-muted-foreground">
          Discover students and posts
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        <Select
          value={universityFilter || "all"}
          onValueChange={(v) => setUniversityFilter(v === "all" ? null : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All universities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All universities</SelectItem>
            {UNIVERSITIES.map((uni) => (
              <SelectItem key={uni} value={uni}>
                {uni}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="w-full">
          <TabsTrigger value="users" className="flex-1">
            Users
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex-1" disabled>
            Posts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : users && users.length > 0 ? (
            users.map((user) => {
              const avatarUrl = user.avatar?.getDirectURL();
              const initials = user.displayName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <Card
                  key={user.username}
                  className="hover:bg-accent/5 transition-colors"
                >
                  <CardContent className="flex items-center gap-3 pt-6">
                    <Avatar className="h-12 w-12">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt={user.displayName} />
                      ) : (
                        <AvatarFallback>{initials}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{user.displayName}</p>
                      <p className="text-sm text-muted-foreground">
                        @{user.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.university}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Follow
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          ) : debouncedTerm ? (
            <div className="py-12 text-center text-muted-foreground">
              No users found matching "{debouncedTerm}"
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              Search for users by name or username
            </div>
          )}
        </TabsContent>

        <TabsContent value="posts">
          <div className="py-12 text-center text-muted-foreground">
            Post search coming soon
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
        <DialogContent className="max-w-lg" data-ocid="explore.composer.dialog">
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
          </DialogHeader>
          <PostComposer />
        </DialogContent>
      </Dialog>

      <FloatingActionButton onClick={() => setComposerOpen(true)} />
    </div>
  );
}
