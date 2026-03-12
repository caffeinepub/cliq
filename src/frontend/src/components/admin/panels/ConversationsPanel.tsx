import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import type { Message } from "../../../backend";
import {
  useGetMessagesAdmin,
  useListConversations,
} from "../../../hooks/useAdminQueries";
import { useGetUserProfile } from "../../../hooks/useQueries";

function MessageItem({ message }: { message: Message }) {
  const { data: senderProfile } = useGetUserProfile(message.sender.toString());

  return (
    <div className="rounded-lg border p-3">
      <p className="text-sm font-semibold">
        {senderProfile?.displayName || "Unknown"}
      </p>
      <p className="text-sm text-muted-foreground">
        {new Date(Number(message.timestamp) / 1000000).toLocaleString()}
      </p>
      <p className="mt-1">{message.content}</p>
    </div>
  );
}

function ConversationItem({ conversation }: { conversation: any }) {
  const participant1 = conversation.participants[0]?.toString();
  const participant2 = conversation.participants[1]?.toString();
  const { data: profile1 } = useGetUserProfile(participant1);
  const { data: profile2 } = useGetUserProfile(participant2);
  const [open, setOpen] = useState(false);
  const { data: messages, isLoading } = useGetMessagesAdmin(
    open ? conversation.id.toString() : undefined,
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer rounded-lg border p-4 hover:bg-accent">
          <div className="mb-2">
            <p className="font-semibold">
              {profile1?.displayName || "Unknown"} ↔{" "}
              {profile2?.displayName || "Unknown"}
            </p>
            <p className="text-sm text-muted-foreground">
              Last message:{" "}
              {new Date(
                Number(conversation.lastMessageTime) / 1000000,
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Conversation Messages</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {messages?.map((msg) => (
                <MessageItem key={msg.id.toString()} message={msg} />
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ConversationsPanel() {
  const [page, setPage] = useState(0);
  const limit = 20;
  const {
    data: conversations,
    isLoading,
    isError,
  } = useListConversations(limit, page * limit);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-destructive">Failed to load conversations</p>
        </CardContent>
      </Card>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <MessageCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">No conversations found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversations Management</CardTitle>
        <CardDescription>
          View platform conversations and messages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id.toString()}
                conversation={conversation}
              />
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page + 1}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={conversations.length < limit}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
