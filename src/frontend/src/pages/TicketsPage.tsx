import { useState } from 'react';
import { useGetMyTickets, useCreateTicketEvent, useVerifyTicket, useCheckInTicket } from '../hooks/useQueries';
import { Loader2, Ticket as TicketIcon, Plus, QrCode, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

export function TicketsPage() {
  const { data: myTickets, isLoading } = useGetMyTickets();
  const createEvent = useCreateTicketEvent();
  const verifyTicket = useVerifyTicket();
  const checkInTicket = useCheckInTicket();
  const navigate = useNavigate();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [availableTickets, setAvailableTickets] = useState('');
  const [verifierCode, setVerifierCode] = useState('');

  const handleCreateEvent = async () => {
    if (!title.trim() || !description.trim() || !eventDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const dateTimestamp = BigInt(new Date(eventDate).getTime()) * BigInt(1000000);
      const eventId = await createEvent.mutateAsync({
        title,
        description,
        eventDate: dateTimestamp,
        verifiers: [],
        ticketPrice: ticketPrice ? parseInt(ticketPrice) : 0,
        availableTickets: availableTickets ? parseInt(availableTickets) : 0,
      });
      toast.success('Event created successfully!');
      setTitle('');
      setDescription('');
      setEventDate('');
      setTicketPrice('');
      setAvailableTickets('');
      setIsCreateOpen(false);
      navigate({ to: '/tickets/$eventId', params: { eventId: eventId.toString() } });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create event');
    }
  };

  const handleVerifyTicket = async () => {
    if (!verifierCode.trim()) {
      toast.error('Please enter a ticket code');
      return;
    }

    try {
      const isValid = await verifyTicket.mutateAsync(verifierCode);
      if (isValid) {
        await checkInTicket.mutateAsync(verifierCode);
        toast.success('Ticket verified and checked in!');
        setVerifierCode('');
      } else {
        toast.error('Invalid or already used ticket');
      }
    } catch (error: any) {
      if (error.message?.includes('already checked in')) {
        toast.error('Ticket already checked in');
      } else {
        toast.error(error.message || 'Failed to verify ticket');
      }
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / BigInt(1000000)));
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-4 p-4">
      <div className="border-b pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate({ to: '/marketplace/tickets' })}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Browse Events
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Campus Concert"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your event..."
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="eventDate">Event Date & Time</Label>
                  <Input
                    id="eventDate"
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ticketPrice">Ticket Price (₦)</Label>
                  <Input
                    id="ticketPrice"
                    type="number"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                    placeholder="0 for free"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="availableTickets">Available Tickets</Label>
                  <Input
                    id="availableTickets"
                    type="number"
                    value={availableTickets}
                    onChange={(e) => setAvailableTickets(e.target.value)}
                    placeholder="Number of tickets"
                    min="0"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleCreateEvent}
                  disabled={createEvent.isPending}
                >
                  {createEvent.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Event'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="my-tickets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="verifier">Verify Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="my-tickets" className="space-y-4 mt-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : myTickets && myTickets.length > 0 ? (
            myTickets.map((ticket) => (
              <Card key={ticket.code}>
                <CardHeader>
                  <CardTitle className="text-lg">Ticket Code: {ticket.code}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span className={`text-sm font-semibold ${ticket.checkedIn ? 'text-chart-1' : 'text-primary'}`}>
                        {ticket.checkedIn ? 'Checked In' : 'Valid'}
                      </span>
                    </div>
                    {ticket.pricePaid > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Price Paid:</span>
                        <span className="text-sm">₦{Number(ticket.pricePaid).toLocaleString()}</span>
                      </div>
                    )}
                    {ticket.checkedInAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Checked in at:</span>
                        <span className="text-sm">{formatDate(ticket.checkedInAt)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <TicketIcon className="mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-semibold">No tickets yet</h2>
              <p className="text-muted-foreground mb-4">Browse the marketplace to get tickets for events</p>
              <Button onClick={() => navigate({ to: '/marketplace/tickets' })}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse Events
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="verifier" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Verify & Check In Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="verifierCode">Ticket Code</Label>
                <Input
                  id="verifierCode"
                  value={verifierCode}
                  onChange={(e) => setVerifierCode(e.target.value)}
                  placeholder="Enter ticket code"
                />
              </div>
              <Button
                className="w-full"
                onClick={handleVerifyTicket}
                disabled={verifyTicket.isPending || checkInTicket.isPending}
              >
                {verifyTicket.isPending || checkInTicket.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <QrCode className="mr-2 h-4 w-4" />
                    Verify & Check In
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
