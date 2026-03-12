import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Plus, Send, Trash2 } from "lucide-react";
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
}

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    content: "Welcome to the room! Remember, everyone is anonymous here 🥷",
    senderIdx: 0,
    timestamp: new Date(Date.now() - 600000),
    type: "message",
    replies: [],
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
      },
    ],
  },
  {
    id: "3",
    content:
      "The food at the school cafeteria has gotten worse this semester tbh",
    senderIdx: 3,
    timestamp: new Date(Date.now() - 120000),
    type: "message",
    replies: [],
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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = (type: "message" | "confession" = "message") => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      senderIdx: myIdx,
      timestamp: new Date(),
      type,
      replies: [],
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

  const deleteRoom = () => {
    toast.success("Room deleted");
    navigate({ to: "/rooms" });
  };

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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Confessions at top */}
        {messages
          .filter((m) => m.type === "confession")
          .map((m) => (
            <Card
              key={m.id}
              className="border-2 border-primary/30 bg-primary/5"
              data-ocid={`room.item.${m.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`h-7 w-7 rounded-full ${ANON_COLORS[m.senderIdx % ANON_COLORS.length]} flex items-center justify-center text-white text-xs font-bold`}
                  >
                    🥷
                  </div>
                  <span className="text-xs font-bold text-primary">
                    CONFESSION
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {m.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm font-semibold">{m.content}</p>
                {m.replies.length > 0 && (
                  <div className="mt-3 space-y-2 border-t pt-3">
                    {m.replies.map((r) => (
                      <div key={r.id} className="flex items-start gap-2">
                        <div
                          className={`h-6 w-6 rounded-full ${ANON_COLORS[r.senderIdx % ANON_COLORS.length]} flex items-center justify-center text-white text-xs shrink-0`}
                        >
                          🥷
                        </div>
                        <p className="text-xs">{r.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  className="mt-2 text-xs text-muted-foreground flex items-center gap-1"
                  onClick={() => setReplyingTo(m.id)}
                  data-ocid={`room.reply.button.${m.id}`}
                >
                  <MessageCircle className="h-3 w-3" /> Reply (
                  {m.replies.length})
                </button>
              </CardContent>
            </Card>
          ))}

        {/* Regular messages */}
        {messages
          .filter((m) => m.type === "message")
          .map((m, i) => (
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

      {/* Input */}
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
      <div className="p-4 border-t-2 bg-card shrink-0 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shrink-0"
          onClick={() => {
            setInput("");
            sendMessage("confession");
          }}
          title="Post confession"
          data-ocid="room.open_modal_button"
        >
          <Plus className="h-4 w-4" />
        </Button>
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
          onClick={() => sendMessage()}
          data-ocid="room.primary_button"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
