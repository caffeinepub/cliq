import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Image, Video, Loader2, X } from 'lucide-react';
import { useGetCallerUserProfile, useCreatePost } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';
import type { MediaAttachment } from '../../backend';

export function PostComposer() {
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: profile } = useGetCallerUserProfile();
  const createPost = useCreatePost();

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      toast.error('Please select an image or video file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }

    setMediaFile(file);
    setMediaType(isImage ? 'image' : 'video');
    setMediaPreview(URL.createObjectURL(file));
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !mediaFile) {
      toast.error('Post cannot be empty');
      return;
    }

    try {
      let media: MediaAttachment | null = null;

      if (mediaFile) {
        const arrayBuffer = await mediaFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });

        if (mediaType === 'image') {
          media = { __kind__: 'image', image: blob };
        } else if (mediaType === 'video') {
          media = { __kind__: 'video', video: blob };
        }
      }

      await createPost.mutateAsync({ content, media });
      toast.success('Post created successfully!');
      setContent('');
      clearMedia();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
    }
  };

  const avatarUrl = profile?.avatar?.getDirectURL();
  const initials = profile?.displayName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const isPosting = createPost.isPending;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={profile?.displayName} />
            ) : (
              <AvatarFallback>{initials || 'U'}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="What's happening on campus?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none border-0 p-0 focus-visible:ring-0"
              disabled={isPosting}
            />
            
            {mediaPreview && (
              <div className="relative rounded-lg overflow-hidden border">
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 rounded-full"
                  onClick={clearMedia}
                  disabled={isPosting}
                >
                  <X className="h-4 w-4" />
                </Button>
                {mediaType === 'image' ? (
                  <img src={mediaPreview} alt="Preview" className="w-full max-h-96 object-cover" />
                ) : (
                  <video src={mediaPreview} controls className="w-full max-h-96" />
                )}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                    <div className="h-full bg-primary transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between border-t pt-3">
              <div className="flex gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaSelect}
                  className="hidden"
                  disabled={isPosting}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPosting || !!mediaFile}
                >
                  <Image className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPosting || !!mediaFile}
                >
                  <Video className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handlePost} disabled={isPosting || (!content.trim() && !mediaFile)} size="sm" className="rounded-full">
                {isPosting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post'
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
