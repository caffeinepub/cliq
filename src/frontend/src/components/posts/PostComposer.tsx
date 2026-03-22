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

type PostDestination = "campus" | "followers";

interface PostComposerProps {
  isAnonymous?: boolean;
}

export function PostComposer({ isAnonymous = false }: PostComposerProps) {
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [boostAfterPost, setBoostAfterPost] = useState(false);
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [newPostId, setNewPostId] = useState<string | null>(null);
  const [destination, setDestination] = useState<PostDestination>("campus");
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

      const finalContent = isAnonymous ? `[anon] ${content}` : content;
      const result = await createPost.mutateAsync({
        content: finalContent,
        media,
      });
      toast.success(
        destination === "campus"
          ? "Posted to your campus!"
          : "Posted to your followers!",
      );
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
      <Card className="border shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <CardContent className="p-5">
          {/* Anonymous banner */}
          {isAnonymous && (
            <div
              data-ocid="post_composer.anonymous_banner"
              className="mb-4 flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5"
            >
              <span className="text-base">🥷</span>
              <span className="text-xs font-semibold text-primary">
                Posting anonymously — your identity is hidden
              </span>
            </div>
          )}
          <div className="flex gap-4">
            <Avatar className="h-11 w-11 border border-border">
              {isAnonymous ? (
                <AvatarFallback className="bg-muted text-lg">🥷</AvatarFallback>
              ) : avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={profile?.displayName} />
              ) : (
                <AvatarFallback className="font-semibold text-sm">
                  {initials || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 space-y-4">
              {isAnonymous && (
                <p className="text-sm text-muted-foreground italic">
                  Anonymous
                </p>
              )}
              <Textarea
                placeholder="What's happening on campus?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none border-0 p-0 text-sm font-normal focus-visible:ring-0"
                disabled={isPosting}
                data-ocid="post_composer.textarea"
              />

              {mediaPreview && (
                <div className="relative rounded-xl overflow-hidden border border-border">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-3 top-3 h-9 w-9 rounded-full z-10 shadow-sm"
                    onClick={clearMedia}
                    disabled={isPosting}
                  >
                    <X className="h-4 w-4" />
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
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Destination selector — My Campus or My Followers Only */}
              <div
                className="flex items-center gap-2"
                data-ocid="post_composer.destination.select"
              >
                <span className="text-xs text-muted-foreground font-medium">
                  Post to:
                </span>
                <button
                  type="button"
                  onClick={() => setDestination("campus")}
                  className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
                    destination === "campus"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                  data-ocid="post_composer.campus.toggle"
                >
                  🏛️ My Campus
                </button>
                <button
                  type="button"
                  onClick={() => setDestination("followers")}
                  className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
                    destination === "followers"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                  data-ocid="post_composer.followers.toggle"
                >
                  👥 My Followers Only
                </button>
              </div>

              {/* Boost toggle */}
              <div
                data-ocid="post_composer.boost_toggle"
                className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Boost this post</span>
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

              <div className="flex items-center justify-between border-t pt-4">
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
                    className="h-9 w-9 rounded-full p-0 text-[#ADB5BD] hover:text-primary hover:bg-primary/10"
                  >
                    <Image className="h-[18px] w-[18px]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => videoInputRef.current?.click()}
                    disabled={isPosting || !!mediaFile}
                    title="Attach video"
                    className="h-9 w-9 rounded-full p-0 text-[#ADB5BD] hover:text-primary hover:bg-primary/10"
                  >
                    <Video className="h-[18px] w-[18px]" />
                  </Button>
                </div>
                <Button
                  onClick={handlePost}
                  disabled={isPosting || (!content.trim() && !mediaFile)}
                  size="default"
                  className="rounded-[40px] px-7 py-3 font-semibold"
                  data-ocid="post_composer.submit_button"
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
