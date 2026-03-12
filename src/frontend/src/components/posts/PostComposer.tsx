import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Image, Loader2, Rocket, Video, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../backend";
import type { MediaAttachment } from "../../backend";
import { useCreatePost, useGetCallerUserProfile } from "../../hooks/useQueries";
import { BoostPostModal } from "../boosts/BoostPostModal";

export function PostComposer() {
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [boostAfterPost, setBoostAfterPost] = useState(false);
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [newPostId, setNewPostId] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { data: profile } = useGetCallerUserProfile();
  const createPost = useCreatePost();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size must be less than 50MB");
      return;
    }
    setMediaFile(file);
    setMediaType("image");
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size must be less than 50MB");
      return;
    }
    setMediaFile(file);
    setMediaType("video");
    setMediaPreview(URL.createObjectURL(file));
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    setUploadProgress(0);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handlePost = async () => {
    if (!content.trim() && !mediaFile) {
      toast.error("Post cannot be empty");
      return;
    }

    try {
      let media: MediaAttachment | null = null;

      if (mediaFile) {
        const arrayBuffer = await mediaFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress(
          (percentage) => setUploadProgress(percentage),
        );
        if (mediaType === "image") {
          media = { __kind__: "image", image: blob };
        } else if (mediaType === "video") {
          media = { __kind__: "video", video: blob };
        }
      }

      const result = await createPost.mutateAsync({ content, media });
      toast.success("Post created successfully!");
      setContent("");
      clearMedia();

      if (boostAfterPost && result) {
        const id = (result as any)?.id?.toString() ?? String(Date.now());
        setNewPostId(id);
        setBoostModalOpen(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create post");
    }
  };

  const avatarUrl = profile?.avatar?.getDirectURL();
  const initials = profile?.displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isPosting = createPost.isPending;

  return (
    <>
      <Card className="border-2 shadow-bold">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Avatar className="h-12 w-12 border-2 border-border">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={profile?.displayName} />
              ) : (
                <AvatarFallback className="font-bold text-base">
                  {initials || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="What's happening on campus?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] resize-none border-0 p-0 text-base font-medium focus-visible:ring-0"
                disabled={isPosting}
              />

              {mediaPreview && (
                <div className="relative rounded-2xl overflow-hidden border-2 border-border">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-3 top-3 h-10 w-10 rounded-full z-10 shadow-bold font-bold"
                    onClick={clearMedia}
                    disabled={isPosting}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  {mediaType === "image" ? (
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="w-full max-h-96 object-cover"
                    />
                  ) : (
                    <video
                      src={mediaPreview}
                      controls
                      playsInline
                      className="w-full max-h-96"
                    >
                      <track kind="captions" />
                    </video>
                  )}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Boost toggle */}
              <div
                data-ocid="post_composer.boost_toggle"
                className="flex items-center justify-between rounded-xl border-2 border-primary/20 bg-primary/5 px-4 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold">Boost this post</span>
                  <span className="text-xs text-muted-foreground">
                    — ₦500/24h
                  </span>
                </div>
                <Switch
                  checked={boostAfterPost}
                  onCheckedChange={setBoostAfterPost}
                  disabled={isPosting}
                />
              </div>

              <div className="flex items-center justify-between border-t-2 pt-4">
                <div className="flex gap-2">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={isPosting}
                  />
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    className="hidden"
                    disabled={isPosting}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isPosting || !!mediaFile}
                    title="Attach image"
                    className="h-10 w-10 rounded-full p-0 hover:bg-accent/20 hover:text-accent"
                  >
                    <Image className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => videoInputRef.current?.click()}
                    disabled={isPosting || !!mediaFile}
                    title="Attach video"
                    className="h-10 w-10 rounded-full p-0 hover:bg-secondary/20 hover:text-secondary"
                  >
                    <Video className="h-5 w-5" />
                  </Button>
                </div>
                <Button
                  onClick={handlePost}
                  disabled={isPosting || (!content.trim() && !mediaFile)}
                  size="lg"
                  className="rounded-full px-8 font-bold shadow-bold"
                >
                  {isPosting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {newPostId && (
        <BoostPostModal
          postId={newPostId}
          open={boostModalOpen}
          onOpenChange={(v) => {
            setBoostModalOpen(v);
            if (!v) setNewPostId(null);
          }}
        />
      )}
    </>
  );
}
