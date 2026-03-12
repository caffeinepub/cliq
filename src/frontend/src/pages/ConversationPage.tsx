import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetConversations,
  useGetMessages,
  useGetUserProfile,
  useSendMessage,
} from "../hooks/useQueries";

export function ConversationPage() {
  const { conversationId } = useParams({ from: "/messages/$conversationId" });
  const navigate = useNavigate();
  const { data: messages, isLoading } = useGetMessages(conversationId);
  const { data: conversations } = useGetConversations();
  const sendMessage = useSendMessage();
  const [messageContent, setMessageContent] = useState("");
  const { identity } = useInternetIdentity();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = conversations?.find(
    (c) => c.id.toString() === conversationId,
  );
  const otherUserPrincipal = conversation?.participants.find(
    (p) => p.toString() !== identity?.getPrincipal().toString(),
  );
  const { data: otherUser } = useGetUserProfile(otherUserPrincipal?.toString());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    try {
      await sendMessage.mutateAsync({
        conversationId: BigInt(conversationId),
        content: messageContent,
      });
      setMessageContent("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const avatarUrl = otherUser?.avatar?.getDirectURL();
  const initials = otherUser?.displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / BigInt(1000000)));
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen">
      <div className="border-b p-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/messages" })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={otherUser?.displayName} />
          ) : (
            <AvatarFallback>{initials || "U"}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <div className="font-semibold">
            {otherUser?.displayName || "Unknown"}
          </div>
          <div className="text-sm text-muted-foreground">
            @{otherUser?.username || "unknown"}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages && messages.length > 0 ? (
          messages.map((message) => {
            const isOwnMessage =
              message.sender.toString() === identity?.getPrincipal().toString();
            return (
              <div
                key={message.id.toString()}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <Card
                  className={`max-w-[70%] ${isOwnMessage ? "bg-primary text-primary-foreground" : ""}`}
                >
                  <CardContent className="p-3">
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                    >
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sendMessage.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={sendMessage.isPending || !messageContent.trim()}
          >
            {sendMessage.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
