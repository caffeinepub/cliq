import { useState, useRef } from 'react';
import { useSearchListings, useCreateListing, useGetCallerUserProfile } from '../hooks/useQueries';
import { Loader2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import { useNavigate } from '@tanstack/react-router';

export function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: listings, isLoading } = useSearchListings(searchTerm);
  const createListing = useCreateListing();
  const { data: profile } = useGetCallerUserProfile();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCreateListing = async () => {
    if (!title.trim() || !description.trim() || !price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      let media: ExternalBlob | null = null;

      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        media = ExternalBlob.fromBytes(uint8Array);
      }

      await createListing.mutateAsync({ title, description, price: priceNum, media });
      toast.success('Listing created successfully!');
      setTitle('');
      setDescription('');
      setPrice('');
      setImageFile(null);
      setImagePreview(null);
      setIsCreateOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create listing');
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="border-b pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <p className="text-sm text-muted-foreground">{profile?.university}</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Listing
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Listing</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Calculus Textbook"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your item..."
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="price">Price (₦)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label>Image (optional)</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select Image
                  </Button>
                )}
              </div>
              <Button
                className="w-full"
                onClick={handleCreateListing}
                disabled={createListing.isPending}
              >
                {createListing.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Listing'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search listings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : listings && listings.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {listings.map((listing) => {
            const imageUrl = listing.media?.getDirectURL();
            return (
              <Card
                key={listing.id.toString()}
                className="cursor-pointer hover:bg-accent/5 transition-colors"
                onClick={() => navigate({ to: '/marketplace/$listingId', params: { listingId: listing.id.toString() } })}
              >
                {imageUrl && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img src={imageUrl} alt={listing.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{listing.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{listing.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">₦{Number(listing.price).toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">{listing.university}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="mb-2 text-xl font-semibold">No listings found</h2>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try a different search term' : 'Be the first to list an item!'}
          </p>
        </div>
      )}
    </div>
  );
}
