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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  MessageCircle,
  Plus,
  Send,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const ANON_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
];
const ANON_COLOR_NAMES = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Purple",
  "Pink",
  "Indigo",
  "Orange",
];
const ANON_NAMES = [
  "Shadow 🥷",
  "Ghost 👻",
  "Phantom 🎭",
  "Ninja 🥷",
  "Mystery 🔮",
  "Specter 👁️",
  "Anonymous 🎪",
  "Hidden 🌙",
];

interface ChatMessage {
  id: string;
  content: string;
  senderIdx: number;
  timestamp: Date;
  type: "message" | "confession";
  replies: ChatMessage[];
  replyTo?: string;
  reactions: number;
}

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    content: "Welcome to the room! Remember, everyone is anonymous here 🥷",
    senderIdx: 0,
    timestamp: new Date(Date.now() - 600000),
    type: "message",
    replies: [],
    reactions: 5,
  },
  {
    id: "2",
    content:
      "I actually failed my first two exams this semester and I have no idea how to tell my parents 😔",
    senderIdx: 1,
    timestamp: new Date(Date.now() - 300000),
    type: "confession",
    replies: [
      {
        id: "2r1",
        content:
          "It happens to the best of us. Have you talked to your academic advisor?",
        senderIdx: 2,
        timestamp: new Date(Date.now() - 240000),
        type: "message",
        replies: [],
        reactions: 3,
      },
      {
        id: "2r2",
        content:
          "You're not alone. Many of us struggled in our first year. Hang in there 💪",
        senderIdx: 4,
        timestamp: new Date(Date.now() - 180000),
        type: "message",
        replies: [],
        reactions: 7,
      },
    ],
    reactions: 12,
  },
  {
    id: "3",
    content:
      "I have a huge crush on someone in my department but I'm too scared to say anything 😅",
    senderIdx: 3,
    timestamp: new Date(Date.now() - 200000),
    type: "confession",
    replies: [
      {
        id: "3r1",
        content: "Just do it! Life is too short 😄",
        senderIdx: 5,
        timestamp: new Date(Date.now() - 150000),
        type: "message",
        replies: [],
        reactions: 4,
      },
    ],
    reactions: 7,
  },
  {
    id: "4",
    content:
      "The food at the school cafeteria has gotten worse this semester tbh",
    senderIdx: 3,
    timestamp: new Date(Date.now() - 120000),
    type: "message",
    replies: [],
    reactions: 2,
  },
  {
    id: "5",
    content: "Anyone else pulling an all-nighter tonight? 🌙",
    senderIdx: 5,
    timestamp: new Date(Date.now() - 60000),
    type: "message",
    replies: [],
    reactions: 0,
  },
];

const myIdx = Math.floor(Math.random() * ANON_NAMES.length);

export function RoomDetailPage() {
  useParams({ from: "/rooms/$roomId" });
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isHost] = useState(false);
  const [confessOpen, setConfessOpen] = useState(false);
  const [confessText, setConfessText] = useState("");
  const [threadMsg, setThreadMsg] = useState<ChatMessage | null>(null);
  const [threadReply, setThreadReply] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      senderIdx: myIdx,
      timestamp: new Date(),
      type: "message",
      replies: [],
      reactions: 0,
    };
    if (replyingTo) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === replyingTo ? { ...m, replies: [...m.replies, newMsg] } : m,
        ),
      );
      setReplyingTo(null);
    } else {
      setMessages((prev) => [...prev, newMsg]);
    }
    setInput("");
  };

  const submitConfession = () => {
    if (!confessText.trim()) {
      toast.error("Write something first!");
      return;
    }
    const newConfession: ChatMessage = {
      id: Date.now().toString(),
      content: confessText,
      senderIdx: myIdx,
      timestamp: new Date(),
      type: "confession",
      replies: [],
      reactions: 0,
    };
    setMessages((prev) => [newConfession, ...prev]);
    setConfessText("");
    setConfessOpen(false);
    toast.success("Confession posted anonymously 🥷");
  };

  const handleReaction = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, reactions: m.reactions + 1 } : m)),
    );
  };

  const submitThreadReply = () => {
    if (!threadReply.trim() || !threadMsg) return;
    const reply: ChatMessage = {
      id: Date.now().toString(),
      content: threadReply,
      senderIdx: myIdx,
      timestamp: new Date(),
      type: "message",
      replies: [],
      reactions: 0,
    };
    setMessages((prev) =>
      prev.map((m) =>
        m.id === threadMsg.id ? { ...m, replies: [...m.replies, reply] } : m,
      ),
    );
    setThreadMsg((prev) =>
      prev ? { ...prev, replies: [...prev.replies, reply] } : prev,
    );
    setThreadReply("");
    toast.success("Reply posted!");
  };

  const deleteRoom = () => {
    toast.success("Room deleted");
    navigate({ to: "/rooms" });
  };

  const confessions = messages.filter((m) => m.type === "confession");
  const chatMessages = messages.filter((m) => m.type === "message");

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 bg-card shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/rooms" })}
            data-ocid="room.back_button"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="font-black text-base">🥷 Anonymous Room</p>
            <p className="text-xs text-muted-foreground">
              Everyone is anonymous here
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Confess button in header */}
          <Button
            size="sm"
            variant="outline"
            className="rounded-full gap-1.5 border-2 text-xs font-bold"
            style={{ borderColor: "#2C8A7A", color: "#2C8A7A" }}
            onClick={() => setConfessOpen(true)}
            data-ocid="room.open_modal_button"
          >
            <Plus className="h-3.5 w-3.5" />
            Confess
          </Button>
          {isHost && (
            <Button
              variant="destructive"
              size="sm"
              className="rounded-full"
              onClick={deleteRoom}
              data-ocid="room.delete_button"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* === CONFESSION POSTCARDS === */}
        {confessions.length > 0 && (
          <div className="space-y-3">
            {confessions.map((m) => (
              <ConfessionCard
                key={m.id}
                message={m}
                onReaction={handleReaction}
                onViewThread={() => setThreadMsg(m)}
              />
            ))}
          </div>
        )}

        {/* Divider between confessions and live chat */}
        <div className="flex items-center gap-3 py-1">
          <Separator className="flex-1" />
          <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
            Live Chat 💬
          </span>
          <Separator className="flex-1" />
        </div>

        {/* === LIVE CHAT MESSAGES === */}
        {chatMessages.map((m, i) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.senderIdx === myIdx ? "flex-row-reverse" : ""}`}
            data-ocid={`room.item.${i + 1}`}
          >
            <div
              className={`h-8 w-8 rounded-full ${ANON_COLORS[m.senderIdx % ANON_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}
            >
              🥷
            </div>
            <div
              className={`max-w-[70%] ${m.senderIdx === myIdx ? "items-end" : "items-start"} flex flex-col`}
            >
              <span className="text-xs text-muted-foreground mb-1">
                {ANON_NAMES[m.senderIdx % ANON_NAMES.length]}
              </span>
              <div
                className={`rounded-2xl px-4 py-2 text-sm ${
                  m.senderIdx === myIdx
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {m.content}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1">
                {m.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Reply banner */}
      {replyingTo && (
        <div className="px-4 py-2 bg-primary/10 border-t text-xs flex items-center justify-between">
          <span className="text-primary font-semibold">
            Replying to confession...
          </span>
          <button
            type="button"
            onClick={() => setReplyingTo(null)}
            className="text-muted-foreground"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input bar — text + send only */}
      <div className="p-4 border-t-2 bg-card shrink-0 flex gap-2">
        <Input
          className="rounded-full"
          placeholder={
            replyingTo ? "Write a reply..." : "🥷 Say something anonymously..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          data-ocid="room.input"
        />
        <Button
          size="icon"
          className="rounded-full shrink-0"
          onClick={sendMessage}
          data-ocid="room.primary_button"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Confession Composer Dialog */}
      <Dialog open={confessOpen} onOpenChange={setConfessOpen}>
        <DialogContent className="max-w-sm" data-ocid="room.confess.dialog">
          <DialogHeader>
            <DialogTitle>Share a Confession 🥷</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            Your identity is completely hidden. Be honest, be kind.
          </p>
          <Textarea
            placeholder="What's on your mind? Share anonymously..."
            value={confessText}
            onChange={(e) => setConfessText(e.target.value)}
            className="min-h-[120px] resize-none"
            data-ocid="room.confess.textarea"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => setConfessOpen(false)}
              data-ocid="room.confess.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-full"
              style={{ backgroundColor: "#2C8A7A" }}
              onClick={submitConfession}
              data-ocid="room.confess.submit_button"
            >
              Post Anonymously
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Thread View Dialog */}
      {threadMsg && (
        <Dialog
          open={!!threadMsg}
          onOpenChange={(o) => !o && setThreadMsg(null)}
        >
          <DialogContent
            className="max-w-sm max-h-[80vh] overflow-y-auto"
            data-ocid="room.thread.dialog"
          >
            <DialogHeader>
              <DialogTitle>Confession Thread</DialogTitle>
            </DialogHeader>
            {/* Confession postcard at top */}
            <ConfessionCard
              message={threadMsg}
              onReaction={handleReaction}
              onViewThread={() => {}}
              compact
            />
            {/* Replies */}
            <div className="space-y-3 mt-2">
              {threadMsg.replies.length === 0 && (
                <p className="text-sm text-center text-muted-foreground py-4">
                  No replies yet. Be the first!
                </p>
              )}
              {threadMsg.replies.map((r, i) => (
                <div
                  key={r.id}
                  className="flex gap-3 pl-4"
                  data-ocid={`room.thread.item.${i + 1}`}
                >
                  <div
                    className={`h-7 w-7 rounded-full ${ANON_COLORS[r.senderIdx % ANON_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                  >
                    🥷
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground mb-0.5">
                      {ANON_NAMES[r.senderIdx % ANON_NAMES.length]}
                    </p>
                    <div className="rounded-xl bg-muted px-3 py-2 text-sm">
                      {r.content}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {r.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Reply input */}
            <div className="flex gap-2 mt-3 pt-3 border-t">
              <Input
                placeholder="Reply anonymously..."
                value={threadReply}
                onChange={(e) => setThreadReply(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitThreadReply()}
                className="rounded-full text-sm"
                data-ocid="room.thread.input"
              />
              <Button
                size="icon"
                className="rounded-full shrink-0"
                style={{ backgroundColor: "#2C8A7A" }}
                onClick={submitThreadReply}
                data-ocid="room.thread.primary_button"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ConfessionCard({
  message,
  onReaction,
  onViewThread,
  compact = false,
}: {
  message: ChatMessage;
  onReaction: (id: string) => void;
  onViewThread: () => void;
  compact?: boolean;
}) {
  const colorName =
    ANON_COLOR_NAMES[message.senderIdx % ANON_COLOR_NAMES.length];
  const colorClass = ANON_COLORS[message.senderIdx % ANON_COLORS.length];

  return (
    <Card
      className="border-2 rounded-2xl"
      style={{
        borderColor: "rgba(44,138,122,0.4)",
        backgroundColor: "rgba(44,138,122,0.05)",
      }}
      data-ocid="room.confession.card"
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div
            className={`h-8 w-8 rounded-full ${colorClass} flex items-center justify-center text-white text-sm font-bold shrink-0`}
          >
            🥷
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">🥷 Anonymous {colorName}</p>
          </div>
          <Badge
            className="text-[10px] font-black tracking-widest uppercase shrink-0"
            style={{ backgroundColor: "#2C8A7A", color: "white" }}
          >
            Confession
          </Badge>
          <span className="text-[10px] text-muted-foreground shrink-0">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>

        {/* Content */}
        <p
          className={`font-semibold leading-relaxed ${compact ? "text-sm" : "text-base"}`}
        >
          {message.content}
        </p>

        {/* Footer */}
        {!compact && (
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => onReaction(message.id)}
              className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-[#2C8A7A] transition-colors"
              data-ocid="room.confession.toggle"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              {message.reactions}
            </button>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MessageCircle className="h-3.5 w-3.5" />
              {message.replies.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-7 text-xs rounded-full px-3"
              style={{ color: "#2C8A7A" }}
              onClick={onViewThread}
              data-ocid="room.confession.button"
            >
              View Thread →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
