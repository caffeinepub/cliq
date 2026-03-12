import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { Clock, Hash, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Room {
  id: string;
  name: string;
  code: string;
  activeUsers: number;
  lastActivity: Date;
  host: string;
}

const generateCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

const INITIAL_ROOMS: Room[] = [
  {
    id: "1",
    name: "Midnight Confessions 🌙",
    code: "MID001",
    activeUsers: 23,
    lastActivity: new Date(Date.now() - 120000),
    host: "anon",
  },
  {
    id: "2",
    name: "Campus Hot Takes 🔥",
    code: "HOT002",
    activeUsers: 45,
    lastActivity: new Date(Date.now() - 60000),
    host: "anon",
  },
  {
    id: "3",
    name: "Study Stress Room 📚",
    code: "STD003",
    activeUsers: 12,
    lastActivity: new Date(Date.now() - 300000),
    host: "anon",
  },
  {
    id: "4",
    name: "Unpopular Opinions 👀",
    code: "OPN004",
    activeUsers: 67,
    lastActivity: new Date(Date.now() - 30000),
    host: "anon",
  },
  {
    id: "5",
    name: "Late Night Thoughts 💭",
    code: "LNT005",
    activeUsers: 34,
    lastActivity: new Date(Date.now() - 90000),
    host: "anon",
  },
];

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export function RoomsPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [joinCode, setJoinCode] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const handleCreate = () => {
    if (!newRoomName.trim()) {
      toast.error("Room name is required");
      return;
    }
    const code = generateCode();
    const room: Room = {
      id: Date.now().toString(),
      name: newRoomName,
      code,
      activeUsers: 1,
      lastActivity: new Date(),
      host: "you",
    };
    setRooms((prev) => [room, ...prev]);
    setCreatedCode(code);
    setNewRoomName("");
  };

  const handleJoin = () => {
    const room = rooms.find(
      (r) => r.code.toUpperCase() === joinCode.toUpperCase(),
    );
    if (!room) {
      toast.error("Room not found. Check the code and try again.");
      return;
    }
    navigate({ to: "/rooms/$roomId", params: { roomId: room.id } });
  };

  const handleEnterRoom = (roomId: string) => {
    navigate({ to: "/rooms/$roomId", params: { roomId } });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            Anonymous Rooms
          </h1>
          <p className="text-sm text-muted-foreground">
            Speak freely. No identity required.
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-full gap-2"
          onClick={() => setCreateOpen(true)}
          data-ocid="rooms.open_modal_button"
        >
          <Plus className="h-4 w-4" /> Create
        </Button>
      </div>

      {/* Join with code */}
      <div className="flex gap-2">
        <Input
          placeholder="Enter room code (e.g. ABC123)"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          className="rounded-full font-mono uppercase"
          data-ocid="rooms.input"
        />
        <Button
          className="rounded-full shrink-0"
          onClick={handleJoin}
          data-ocid="rooms.primary_button"
        >
          Join
        </Button>
      </div>

      {/* Top 5 Active Rooms */}
      <div>
        <h2 className="font-black text-base mb-3 flex items-center gap-2">
          <span className="text-primary">🔥</span> Top Active Rooms
        </h2>
        <div className="space-y-3">
          {rooms.slice(0, 5).map((room, i) => (
            <Card
              key={room.id}
              className="cursor-pointer hover:shadow-bold transition-all border-2 active:scale-[0.99]"
              onClick={() => handleEnterRoom(room.id)}
              data-ocid={`rooms.item.${i + 1}`}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Hash className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{room.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {room.activeUsers} online
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {timeAgo(room.lastActivity)}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded-lg">
                    {room.code}
                  </code>
                  {i === 0 && (
                    <div className="mt-1">
                      <Badge variant="destructive" className="text-xs">
                        Hottest 🔥
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Room Dialog */}
      <Dialog
        open={createOpen}
        onOpenChange={(o) => {
          setCreateOpen(o);
          if (!o) setCreatedCode(null);
        }}
      >
        <DialogContent data-ocid="rooms.dialog">
          <DialogHeader>
            <DialogTitle>🥷 Create Anonymous Room</DialogTitle>
          </DialogHeader>
          {createdCode ? (
            <div className="space-y-4 text-center">
              <div className="py-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Share this code to invite others
                </p>
                <code className="text-4xl font-black font-mono tracking-[0.3em] text-primary">
                  {createdCode}
                </code>
              </div>
              <Button
                className="w-full rounded-full"
                onClick={() => {
                  setCreateOpen(false);
                  setCreatedCode(null);
                  navigate({
                    to: "/rooms/$roomId",
                    params: { roomId: rooms[0].id },
                  });
                }}
                data-ocid="rooms.confirm_button"
              >
                Enter Room
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={() => {
                  navigator.clipboard.writeText(createdCode);
                  toast.success("Code copied!");
                }}
                data-ocid="rooms.secondary_button"
              >
                Copy Code
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                placeholder="Room name..."
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                data-ocid="rooms.input"
              />
              <Button
                className="w-full rounded-full"
                onClick={handleCreate}
                data-ocid="rooms.submit_button"
              >
                Create Room
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
