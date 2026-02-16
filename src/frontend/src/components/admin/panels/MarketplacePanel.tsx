import { useState } from 'react';
import { useListMarketplaceListings, useMarkListingAsSold, useDeleteListing } from '../../../hooks/useAdminQueries';
import { useGetUserProfile } from '../../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingBag, Trash2, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function ListingItem({ listing }: { listing: any }) {
  const { data: sellerProfile } = useGetUserProfile(listing.seller.toString());
  const markAsSold = useMarkListingAsSold();
  const deleteListing = useDeleteListing();

  const handleMarkSold = async () => {
    try {
      await markAsSold.mutateAsync(listing.id);
      toast.success('Listing marked as sold');
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark listing as sold');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteListing.mutateAsync(listing.id);
      toast.success('Listing deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete listing');
    }
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold">{listing.title}</p>
            {listing.sold && <Badge variant="secondary">Sold</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">
            Seller: {sellerProfile?.displayName || 'Unknown'}
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(Number(listing.timestamp) / 1000000).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          {!listing.sold && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkSold}
              disabled={markAsSold.isPending}
            >
              {markAsSold.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" disabled={deleteListing.isPending}>
                {deleteListing.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 text-destructive" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this listing? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <p className="mb-2">{listing.description}</p>
      {listing.media && (
        <img
          src={listing.media.getDirectURL()}
          alt={listing.title}
          className="mb-2 max-h-48 rounded-lg object-cover"
        />
      )}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">₦{Number(listing.price).toLocaleString()}</span>
        <span>{listing.university}</span>
      </div>
    </div>
  );
}

export function MarketplacePanel() {
  const [page, setPage] = useState(0);
  const limit = 20;
  const { data: listings, isLoading, isError } = useListMarketplaceListings(limit, page * limit);

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
          <p className="text-destructive">Failed to load marketplace listings</p>
        </CardContent>
      </Card>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">No marketplace listings found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketplace Management</CardTitle>
        <CardDescription>View and moderate marketplace listings</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {listings.map((listing) => (
              <ListingItem key={listing.id.toString()} listing={listing} />
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
            disabled={listings.length < limit}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
