import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Globe, Lock, Plus, Search, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Community {
  id: string;
  name: string;
  description: string;
  avatar: string;
  members: number;
  university: string;
  isPrivate: boolean;
  joined: boolean;
  pending?: boolean;
}

const MOCK_COMMUNITIES: Community[] = [
  {
    id: "1",
    name: "UNILAG Tech Hub",
    description: "Connect with tech enthusiasts at UNILAG",
    avatar: "💻",
    members: 234,
    university: "University of Lagos (UNILAG)",
    isPrivate: false,
    joined: true,
  },
  {
    id: "2",
    name: "UI Medical Students",
    description: "For medical students at the University of Ibadan",
    avatar: "🏥",
    members: 189,
    university: "University of Ibadan (UI)",
    isPrivate: true,
    joined: false,
  },
  {
    id: "3",
    name: "OAU Arts & Culture",
    description: "Celebrating creativity and cultural expression",
    avatar: "🎨",
    members: 312,
    university: "Obafemi Awolowo University (OAU)",
    isPrivate: false,
    joined: false,
  },
  {
    id: "4",
    name: "Campus Entrepreneurs",
    description: "Build your startup while in school",
    avatar: "🚀",
    members: 567,
    university: "All Universities",
    isPrivate: false,
    joined: true,
  },
  {
    id: "5",
    name: "Night Owls Study Group",
    description: "Late night study sessions and academic support",
    avatar: "🦉",
    members: 98,
    university: "University of Nigeria, Nsukka (UNN)",
    isPrivate: true,
    joined: false,
  },
  {
    id: "6",
    name: "Campus Foodies",
    description: "Best spots to eat on and around campus",
    avatar: "🍔",
    members: 445,
    university: "All Universities",
    isPrivate: false,
    joined: false,
  },
];

export function CommunitiesPage() {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrivate, setNewPrivate] = useState(false);
  const [activeTab, setActiveTab] = useState<"joined" | "discover">("joined");

  const filtered = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()),
  );

  const joined = filtered.filter((c) => c.joined);
  const discover = filtered.filter((c) => !c.joined);

  const handleJoin = (id: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        if (c.isPrivate) {
          toast.success("Request sent! Waiting for admin approval.");
          return { ...c, pending: true };
        }
        toast.success(`Joined ${c.name}!`);
        return { ...c, joined: true };
      }),
    );
  };

  const handleLeave = (id: string) => {
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, joined: false, pending: false } : c,
      ),
    );
  };

  const handleCreate = () => {
    if (!newName.trim()) {
      toast.error("Community name is required");
      return;
    }
    const community: Community = {
      id: Date.now().toString(),
      name: newName,
      description: newDesc,
      avatar: "🏛️",
      members: 1,
      university: "Your University",
      isPrivate: newPrivate,
      joined: true,
    };
    setCommunities((prev) => [community, ...prev]);
    setNewName("");
    setNewDesc("");
    setNewPrivate(false);
    setCreateOpen(false);
    toast.success("Community created!");
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight">Communities</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="rounded-full gap-2"
              data-ocid="communities.open_modal_button"
            >
              <Plus className="h-4 w-4" /> Create
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="communities.dialog">
            <DialogHeader>
              <DialogTitle>Create Community</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Community Name</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Campus Coders"
                  data-ocid="communities.input"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What is this community about?"
                  data-ocid="communities.textarea"
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={newPrivate}
                  onCheckedChange={setNewPrivate}
                  data-ocid="communities.private.switch"
                />
                <Label>
                  {newPrivate ? (
                    <span className="flex items-center gap-1">
                      <Lock className="h-4 w-4" /> Private
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Globe className="h-4 w-4" /> Public
                    </span>
                  )}
                </Label>
              </div>
              <Button
                className="w-full rounded-full"
                onClick={handleCreate}
                data-ocid="communities.submit_button"
              >
                Create Community
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9 rounded-full"
          placeholder="Search communities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-ocid="communities.search_input"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "joined" ? "default" : "ghost"}
          size="sm"
          className="rounded-full"
          onClick={() => setActiveTab("joined")}
          data-ocid="communities.joined.tab"
        >
          Joined ({joined.length})
        </Button>
        <Button
          variant={activeTab === "discover" ? "default" : "ghost"}
          size="sm"
          className="rounded-full"
          onClick={() => setActiveTab("discover")}
          data-ocid="communities.discover.tab"
        >
          Discover ({discover.length})
        </Button>
      </div>

      {activeTab === "joined" && (
        <div className="space-y-3">
          {joined.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="communities.empty_state"
            >
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No communities yet</p>
              <p className="text-sm">Discover and join communities below</p>
            </div>
          ) : (
            joined.map((c, i) => (
              <CommunityCard
                key={c.id}
                community={c}
                index={i + 1}
                onJoin={handleJoin}
                onLeave={handleLeave}
                onClick={() =>
                  navigate({
                    to: "/communities/$communityId",
                    params: { communityId: c.id },
                  })
                }
              />
            ))
          )}
        </div>
      )}

      {activeTab === "discover" && (
        <div className="space-y-3">
          {discover.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="communities.empty_state"
            >
              <p className="font-semibold">No communities to discover</p>
            </div>
          ) : (
            discover.map((c, i) => (
              <CommunityCard
                key={c.id}
                community={c}
                index={i + 1}
                onJoin={handleJoin}
                onLeave={handleLeave}
                onClick={() =>
                  navigate({
                    to: "/communities/$communityId",
                    params: { communityId: c.id },
                  })
                }
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function CommunityCard({
  community,
  index,
  onJoin,
  onLeave,
  onClick,
}: {
  community: Community;
  index: number;
  onJoin: (id: string) => void;
  onLeave: (id: string) => void;
  onClick: () => void;
}) {
  return (
    <Card
      className="cursor-pointer hover:shadow-bold transition-all border-2"
      onClick={onClick}
      data-ocid={`communities.item.${index}`}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
          {community.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold truncate">{community.name}</span>
            {community.isPrivate ? (
              <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            ) : (
              <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {community.description}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {community.members} members
            </Badge>
            <span className="text-xs text-muted-foreground truncate">
              {community.university}
            </span>
          </div>
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {community.joined ? (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full shrink-0"
              onClick={() => onLeave(community.id)}
              data-ocid={`communities.leave.button.${index}`}
            >
              Leave
            </Button>
          ) : community.pending ? (
            <Badge variant="secondary" className="text-xs">
              Pending
            </Badge>
          ) : (
            <Button
              size="sm"
              className="rounded-full shrink-0"
              onClick={() => onJoin(community.id)}
              data-ocid={`communities.item.${index}`}
            >
              {community.isPrivate ? "Request" : "Join"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
