import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';
import { ExternalBlob } from '../../backend';
import { toast } from 'sonner';

interface AvatarUploaderProps {
  value?: ExternalBlob;
  onChange: (blob: ExternalBlob | undefined) => void;
}

export function AvatarUploader({ value, onChange }: AvatarUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    value ? value.getDirectURL() : undefined
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onChange(blob);
      toast.success('Avatar uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload avatar');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        {previewUrl ? (
          <AvatarImage src={previewUrl} alt="Avatar preview" />
        ) : (
          <AvatarFallback>
            <Camera className="h-8 w-8 text-muted-foreground" />
          </AvatarFallback>
        )}
      </Avatar>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Camera className="mr-2 h-4 w-4" />
            {value ? 'Change Avatar' : 'Upload Avatar'}
          </>
        )}
      </Button>
    </div>
  );
}
