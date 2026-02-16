import { useState } from 'react';
import { useBrowseTicketEvents } from '../hooks/useQueries';
import { Loader2, Calendar, MapPin, Ticket as TicketIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from '@tanstack/react-router';
import { UNIVERSITIES } from '../constants/universities';

export function TicketMarketplacePage() {
  const [universityFilter, setUniversityFilter] = useState<string | null>(null);
  const { data: events, isLoading } = useBrowseTicketEvents(universityFilter);
  const navigate = useNavigate();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / BigInt(1000000)));
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-4 p-4">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">Ticket Marketplace</h1>
        <p className="text-muted-foreground mt-1">Browse and purchase tickets for campus events</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="university-filter">Filter by University</Label>
              <Select
                value={universityFilter || 'all'}
                onValueChange={(value) => setUniversityFilter(value === 'all' ? null : value)}
              >
                <SelectTrigger id="university-filter">
                  <SelectValue placeholder="All Universities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  {UNIVERSITIES.map((uni) => (
                    <SelectItem key={uni} value={uni}>
                      {uni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card
              key={event.id.toString()}
              className="hover:bg-accent/5 transition-colors cursor-pointer"
              onClick={() => navigate({ to: '/marketplace/tickets/$eventId', params: { eventId: event.id.toString() } })}
            >
              <CardHeader>
                <CardTitle className="text-lg">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.university}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TicketIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{Number(event.availableTickets)} tickets available</span>
                  </div>
                  {event.ticketPrice > 0 && (
                    <div className="text-sm font-semibold">
                      ₦{Number(event.ticketPrice).toLocaleString()}
                    </div>
                  )}
                </div>
                <Button className="w-full" size="sm">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <TicketIcon className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">No events available</h2>
          <p className="text-muted-foreground">
            {universityFilter
              ? 'No events found for the selected university'
              : 'Check back later for upcoming events'}
          </p>
        </div>
      )}
    </div>
  );
}
