import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useNavigate } from "@tanstack/react-router";
import { Loader2, MessageCircle, Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Conversation } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetConversations,
  useSearchUsers,
  useStartConversation,
} from "../hooks/useQueries";
import { useGetUserProfile } from "../hooks/useQueries";

function ConversationItem({ conversation }: { conversation: Conversation }) {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const otherUserPrincipal = conversation.participants.find(
    (p) => p.toString() !== identity?.getPrincipal().toString(),
  );
  const { data: otherUser } = useGetUserProfile(otherUserPrincipal?.toString());

  const avatarUrl = otherUser?.avatar?.getDirectURL();
  const initials = otherUser?.displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card
      className="cursor-pointer hover:bg-accent/5 transition-colors"
      onClick={() =>
        navigate({
          to: "/messages/$conversationId",
          params: { conversationId: conversation.id.toString() },
        })
      }
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={otherUser?.displayName} />
            ) : (
              <AvatarFallback>{initials || "U"}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <div className="font-semibold">
              {otherUser?.displayName || "Unknown"}
            </div>
            <div className="text-sm text-muted-foreground">
              @{otherUser?.username || "unknown"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MessagesPage() {
  const { data: conversations, isLoading } = useGetConversations();
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: searchResults } = useSearchUsers(searchTerm, null);
  const startConversation = useStartConversation();
  const navigate = useNavigate();

  const handleStartConversation = async (userPrincipal: string) => {
    try {
      const conversationId = await startConversation.mutateAsync(userPrincipal);
      setIsNewConversationOpen(false);
      navigate({
        to: "/messages/$conversationId",
        params: { conversationId: conversationId.toString() },
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to start conversation");
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="border-b pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Dialog
          open={isNewConversationOpen}
          onOpenChange={setIsNewConversationOpen}
        >
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Conversation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchResults && searchResults.length > 0 ? (
                  searchResults.map((user) => {
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
                        className="cursor-pointer hover:bg-accent/5 transition-colors"
                        onClick={() => handleStartConversation(user.username)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              {avatarUrl ? (
                                <AvatarImage
                                  src={avatarUrl}
                                  alt={user.displayName}
                                />
                              ) : (
                                <AvatarFallback>{initials}</AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <div className="font-semibold">
                                {user.displayName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : searchTerm ? (
                  <p className="text-center text-muted-foreground py-4">
                    No users found
                  </p>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Search for a user to start a conversation
                  </p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : conversations && conversations.length > 0 ? (
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id.toString()}
              conversation={conversation}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MessageCircle className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">No conversations yet</h2>
          <p className="text-muted-foreground mb-4">
            Start a conversation with someone!
          </p>
        </div>
      )}
    </div>
  );
}
