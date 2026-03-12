import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Loader2,
  MapPin,
  Ticket as TicketIcon,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetMyTickets,
  useGetTicketEvent,
  usePurchaseTicket,
} from "../hooks/useQueries";

export function TicketMarketplaceEventDetailPage() {
  const navigate = useNavigate();
  const eventId = "";
  const { data: event, isLoading: eventLoading } = useGetTicketEvent(eventId);
  const { data: myTickets } = useGetMyTickets();
  const purchaseTicket = usePurchaseTicket();

  const hasTicket = myTickets?.some(
    (ticket) => ticket.eventId.toString() === eventId,
  );

  const handlePurchase = async () => {
    if (!event) return;

    try {
      await purchaseTicket.mutateAsync(event.id);
      toast.success("Ticket purchased successfully!");
    } catch (error: any) {
      if (error.message?.includes("already have a ticket")) {
        toast.error("You already have a ticket for this event");
      } else if (error.message?.includes("No tickets available")) {
        toast.error("Sorry, this event is sold out");
      } else {
        toast.error(error.message || "Failed to purchase ticket");
      }
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / BigInt(1000000)));
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  return (
    <div className="space-y-4 p-4">
      <div className="border-b pb-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/marketplace" })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Event Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">Date & Time</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(event.eventDate)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">Location</div>
                <div className="text-sm text-muted-foreground">
                  {event.university}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <TicketIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">Available Tickets</div>
                <div className="text-sm text-muted-foreground">
                  {Number(event.availableTickets)}{" "}
                  {Number(event.availableTickets) === 1 ? "ticket" : "tickets"}{" "}
                  remaining
                </div>
              </div>
            </div>

            {event.ticketPrice > 0 && (
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 flex items-center justify-center text-muted-foreground mt-0.5">
                  ₦
                </div>
                <div>
                  <div className="font-medium">Price</div>
                  <div className="text-sm text-muted-foreground">
                    ₦{Number(event.ticketPrice).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {event.verifiers.length > 0 && (
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Verifiers</div>
                  <div className="text-sm text-muted-foreground">
                    {event.verifiers.length} authorized{" "}
                    {event.verifiers.length === 1 ? "verifier" : "verifiers"}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">About this event</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          <div className="border-t pt-4">
            {hasTicket ? (
              <div className="bg-accent/50 rounded-lg p-4 text-center">
                <TicketIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-medium">
                  You already have a ticket for this event
                </p>
                <Button
                  variant="outline"
                  className="mt-3"
                  onClick={() => navigate({ to: "/" })}
                >
                  Go Home
                </Button>
              </div>
            ) : event.availableTickets === BigInt(0) ? (
              <div className="bg-destructive/10 rounded-lg p-4 text-center">
                <p className="font-medium text-destructive">Sold Out</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This event has no more tickets available
                </p>
              </div>
            ) : (
              <Button
                className="w-full"
                size="lg"
                onClick={handlePurchase}
                disabled={purchaseTicket.isPending}
              >
                {purchaseTicket.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <TicketIcon className="mr-2 h-5 w-5" />
                    {event.ticketPrice > 0
                      ? `Get Ticket - ₦${Number(event.ticketPrice).toLocaleString()}`
                      : "Get Free Ticket"}
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
