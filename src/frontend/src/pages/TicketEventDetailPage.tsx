import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useGetEventTickets,
  useGetTicketEvent,
  useIssueTicket,
} from "../hooks/useQueries";

export function TicketEventDetailPage() {
  const navigate = useNavigate();
  const eventId = "";
  const { data: event, isLoading: eventLoading } = useGetTicketEvent(eventId);
  const { data: tickets, isLoading: ticketsLoading } =
    useGetEventTickets(eventId);
  const issueTicket = useIssueTicket();

  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [attendeePrincipal, setAttendeePrincipal] = useState("");
  const [ticketCode, setTicketCode] = useState("");

  const handleIssueTicket = async () => {
    if (!attendeePrincipal.trim() || !ticketCode.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await issueTicket.mutateAsync({
        eventId: BigInt(eventId),
        attendee: attendeePrincipal,
        code: ticketCode,
      });
      toast.success("Ticket issued successfully!");
      setAttendeePrincipal("");
      setTicketCode("");
      setIsIssueOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to issue ticket");
    }
  };

  const generateRandomCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setTicketCode(code);
  };

  if (eventLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="space-y-4 p-4">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold">Event not found</h1>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / BigInt(1000000)));
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <div className="space-y-4 p-4">
      <div className="border-b pb-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/" })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Event Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
          <div className="border-t pt-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  University:
                </span>
                <span className="text-sm font-semibold">
                  {event.university}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Event Date:
                </span>
                <span className="text-sm font-semibold">
                  {formatDate(event.eventDate)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Issued Tickets</h2>
        <Dialog open={isIssueOpen} onOpenChange={setIsIssueOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Issue Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Issue Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="attendeePrincipal">Attendee Principal</Label>
                <Input
                  id="attendeePrincipal"
                  value={attendeePrincipal}
                  onChange={(e) => setAttendeePrincipal(e.target.value)}
                  placeholder="Enter principal ID"
                />
              </div>
              <div>
                <Label htmlFor="ticketCode">Ticket Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="ticketCode"
                    value={ticketCode}
                    onChange={(e) => setTicketCode(e.target.value)}
                    placeholder="Enter or generate code"
                  />
                  <Button variant="outline" onClick={generateRandomCode}>
                    Generate
                  </Button>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handleIssueTicket}
                disabled={issueTicket.isPending}
              >
                {issueTicket.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Issuing...
                  </>
                ) : (
                  "Issue Ticket"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {ticketsLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : tickets && tickets.length > 0 ? (
        <div className="space-y-2">
          {tickets.map((ticket) => (
            <Card key={ticket.code}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Code: {ticket.code}</div>
                    <div className="text-sm text-muted-foreground">
                      Attendee: {ticket.attendee.toString().slice(0, 10)}...
                    </div>
                  </div>
                  <div
                    className={`text-sm font-semibold ${ticket.checkedIn ? "text-chart-1" : "text-primary"}`}
                  >
                    {ticket.checkedIn ? "Checked In" : "Valid"}
                  </div>
                </div>
                {ticket.checkedInAt && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Checked in: {formatDate(ticket.checkedInAt)}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          No tickets issued yet
        </p>
      )}
    </div>
  );
}
