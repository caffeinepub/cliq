import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetListing, useGetUserProfile } from '../hooks/useQueries';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function ListingDetailPage() {
  const { listingId } = useParams({ from: '/marketplace/$listingId' });
  const navigate = useNavigate();
  const { data: listing, isLoading } = useGetListing(listingId);
  const { data: sellerProfile } = useGetUserProfile(listing?.seller.toString());

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="space-y-4 p-4">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold">Listing not found</h1>
        </div>
      </div>
    );
  }

  const imageUrl = listing.media?.getDirectURL();
  const avatarUrl = sellerProfile?.avatar?.getDirectURL();
  const initials = sellerProfile?.displayName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / BigInt(1000000)));
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4 p-4">
      <div className="border-b pb-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/marketplace' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Listing Details</h1>
      </div>

      <Card>
        {imageUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img src={imageUrl} alt={listing.title} className="w-full h-full object-cover" />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-2xl">{listing.title}</CardTitle>
          <div className="text-3xl font-bold text-primary">₦{Number(listing.price).toLocaleString()}</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Seller Information</h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={sellerProfile?.displayName} />
                ) : (
                  <AvatarFallback>{initials || 'U'}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <div className="font-semibold">{sellerProfile?.displayName || 'Unknown'}</div>
                <div className="text-sm text-muted-foreground">@{sellerProfile?.username || 'unknown'}</div>
                <div className="text-sm text-muted-foreground">{listing.university}</div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 text-sm text-muted-foreground">
            Listed on {formatTimestamp(listing.timestamp)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
