import { useState } from 'react';
import { useListTicketEvents } from '../../../hooks/useAdminQueries';
import { useGetUserProfile } from '../../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Ticket, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

function EventItem({ event }: { event: any }) {
  const { data: creatorProfile } = useGetUserProfile(event.creator.toString());

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2">
        <p className="font-semibold">{event.title}</p>
        <p className="text-sm text-muted-foreground">
          Creator: {creatorProfile?.displayName || 'Unknown'}
        </p>
        <p className="text-sm text-muted-foreground">
          Event Date: {new Date(Number(event.eventDate) / 1000000).toLocaleString()}
        </p>
      </div>
      <p className="mb-2">{event.description}</p>
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>{event.university}</span>
        <span>{event.verifiers.length} verifiers</span>
      </div>
    </div>
  );
}

export function TicketsEventsPanel() {
  const [page, setPage] = useState(0);
  const limit = 20;
  const { data: events, isLoading, isError } = useListTicketEvents(limit, page * limit);

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
          <p className="text-destructive">Failed to load ticket events</p>
        </CardContent>
      </Card>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Ticket className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">No ticket events found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets & Events Management</CardTitle>
        <CardDescription>View platform ticket events</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {events.map((event) => (
              <EventItem key={event.id.toString()} event={event} />
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
            disabled={events.length < limit}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
