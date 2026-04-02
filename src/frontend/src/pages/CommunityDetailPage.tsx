import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  EyeOff,
  Flame,
  Lock,
  MessageCircle,
  Send,
  Share2,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface CommunityPost {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  isHidden?: boolean;
  isLocked?: boolean;
}

interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  depth: number;
  parentId: string | null;
  isLiked?: boolean;
  isRecliqed?: boolean;
}

// ─────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────

const MOCK_POSTS: CommunityPost[] = [
  {
    id: "1",
    author: "Ada Obi",
    content:
      "Anyone else working on the ML project for next semester? Would love to collaborate!",
    timestamp: new Date(Date.now() - 3600000),
    likes: 12,
  },
  {
    id: "2",
    author: "Tunde Akin",
    content:
      "Great hackathon last weekend! Huge shoutout to everyone who participated 🚀",
    timestamp: new Date(Date.now() - 7200000),
    likes: 34,
  },
  {
    id: "3",
    author: "Chioma Nze",
    content:
      "Free Python workshop this Saturday at the CS lab. All levels welcome! Drop a 👋 if you are coming",
    timestamp: new Date(Date.now() - 86400000),
    likes: 56,
  },
];

const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    postId: "1",
    author: "Emeka Eze",
    content: "I am in! DM me",
    timestamp: new Date(Date.now() - 1800000),
    likes: 3,
    depth: 0,
    parentId: null,
  },
  {
    id: "c2",
    postId: "1",
    author: "Fatima Bello",
    content: "Same here, been working on NLP stuff",
    timestamp: new Date(Date.now() - 900000),
    likes: 1,
    depth: 1,
    parentId: "c1",
  },
  {
    id: "c3",
    postId: "2",
    author: "Sola Adeyemi",
    content: "That was amazing! Our team almost made it to finals",
    timestamp: new Date(Date.now() - 5400000),
    likes: 8,
    depth: 0,
    parentId: null,
  },
  {
    id: "c4",
    postId: "2",
    author: "Kene Ogu",
    content: "Next time for sure! 💪",
    timestamp: new Date(Date.now() - 3600000),
    likes: 2,
    depth: 1,
    parentId: "c3",
  },
];

const MOCK_MEMBERS = [
  "Ada Obi",
  "Tunde Akin",
  "Chioma Nze",
  "Emeka Eze",
  "Fatima Bello",
  "Sola Adeyemi",
  "Kene Ogu",
  "Bisi Lawal",
];

// ─────────────────────────────────────────────
// Reblog icon
// ─────────────────────────────────────────────

function ReblogIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      role="img"
      aria-label="Recliq"
    >
      <title>Recliq</title>
      <path d="M7 4v4H3l5 6 5-6H9V4H7zm10 16v-4h4l-5-6-5 6h4v4h2z" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// ThreadedComment component
// ─────────────────────────────────────────────

function ThreadedComment({
  comment,
  allComments,
  onAddReply,
}: {
  comment: Comment;
  allComments: Comment[];
  onAddReply: (parentId: string, content: string, depth: number) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const [recliqed, setRecliqed] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);

  const children = allComments.filter((c) => c.parentId === comment.id);

  const depthStyles: Record<number, string> = {
    0: "",
    1: "ml-6 border-l-2 border-[#F0F0F0] pl-3",
    2: "ml-12 border-l-2 border-[#E8432D]/30 pl-3",
    3: "ml-16 border-l-2 border-[#ADB5BD] pl-3",
  };

  const indentClass = depthStyles[comment.depth] ?? depthStyles[3];

  const initials = comment.author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onAddReply(comment.id, replyText, comment.depth);
    setReplyText("");
    setShowReplyBox(false);
    setShowReplies(true);
  };

  const formatTime = (d: Date) => {
    const mins = Math.floor((Date.now() - d.getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className={indentClass}>
      <div className="flex gap-2 items-start py-2">
        <Avatar className="h-7 w-7 flex-shrink-0">
          <AvatarFallback className="text-[10px] font-bold bg-[#E8432D]/10 text-[#E8432D]">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold text-[#212529] dark:text-zinc-100">
              {comment.author}
            </span>
            <span className="text-[10px] text-[#ADB5BD]">
              {formatTime(comment.timestamp)}
            </span>
          </div>
          <p className="text-sm text-[#212529] dark:text-zinc-200 leading-relaxed">
            {comment.content}
          </p>
          {/* Engagement row */}
          <div className="flex items-center gap-1 mt-1.5">
            <button
              type="button"
              onClick={() => {
                setLiked((p) => !p);
                setLikeCount((p) => (liked ? p - 1 : p + 1));
              }}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs transition-colors ${
                liked ? "text-[#E8432D]" : "text-[#ADB5BD] hover:text-[#E8432D]"
              }`}
            >
              <Flame className="h-3.5 w-3.5" />
              <span className="font-bold">{likeCount}</span>
            </button>

            {comment.depth < 3 && (
              <button
                type="button"
                onClick={() => setShowReplyBox((p) => !p)}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-[#ADB5BD] hover:text-blue-500 transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Reply</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setRecliqed((p) => !p)}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs transition-colors ${
                recliqed
                  ? "text-[#E8432D]"
                  : "text-[#ADB5BD] hover:text-[#E8432D]"
              }`}
            >
              <ReblogIcon className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Inline reply box */}
          {showReplyBox && (
            <div className="mt-2 space-y-1">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleReplySubmit();
                  }
                }}
                placeholder="Write a reply..."
                className="resize-none text-xs min-h-[56px] rounded-lg"
                rows={2}
              />
              <p className="text-[10px] text-[#ADB5BD]">Ctrl+Enter to reply</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="rounded-full h-7 text-xs bg-[#E8432D] hover:bg-[#e8432d]"
                  onClick={handleReplySubmit}
                >
                  Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full h-7 text-xs"
                  onClick={() => setShowReplyBox(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies toggle */}
      {children.length > 0 && (
        <div className="mt-1">
          <button
            type="button"
            onClick={() => setShowReplies((p) => !p)}
            className="flex items-center gap-1 text-[11px] text-[#E8432D] font-semibold px-2 py-0.5 hover:underline"
          >
            {showReplies ? "▼" : "▶"} {children.length} repl
            {children.length === 1 ? "y" : "ies"}
          </button>
          {showReplies && (
            <div className="space-y-0">
              {children.map((child) => (
                <ThreadedComment
                  key={child.id}
                  comment={child}
                  allComments={allComments}
                  onAddReply={onAddReply}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────

export function CommunityDetailPage() {
  useParams({ from: "/communities/$communityId" });
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_POSTS);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newPost, setNewPost] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set(),
  );

  const isAdmin = localStorage.getItem("cliq_is_admin") === "true";

  const handlePost = () => {
    if (!newPost.trim()) return;
    setPosts((prev) => [
      {
        id: Date.now().toString(),
        author: "You",
        content: newPost,
        timestamp: new Date(),
        likes: 0,
      },
      ...prev,
    ]);
    setNewPost("");
    toast.success("Post shared!");
  };

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const handleHidePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isHidden: true } : p)),
    );
    toast.info("Post hidden by admin");
  };

  const handleLockPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isLocked: !p.isLocked } : p)),
    );
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    toast.success("Post deleted");
  };

  const handleAddReply = (
    parentId: string,
    content: string,
    parentDepth: number,
  ) => {
    const parent = comments.find((c) => c.id === parentId);
    const newComment: Comment = {
      id: `c${Date.now()}`,
      postId: parent?.postId ?? "",
      author: "You",
      content,
      timestamp: new Date(),
      likes: 0,
      depth: Math.min(parentDepth + 1, 3),
      parentId,
    };
    setComments((prev) => [...prev, newComment]);
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const formatTime = (d: Date) => {
    const mins = Math.floor((Date.now() - d.getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const visiblePosts = posts.filter((p) => !p.isHidden);

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-[#F0F0F0] dark:border-zinc-800 p-4 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/communities" })}
            data-ocid="community.back_button"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
            💻
          </div>
          <div>
            <h1 className="font-black text-lg">UNILAG Tech Hub</h1>
            <p className="text-xs text-muted-foreground">234 members</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full grid grid-cols-2 h-11 rounded-none border-b border-[#F0F0F0] dark:border-zinc-800">
          <TabsTrigger value="posts" data-ocid="community.posts.tab">
            Posts
          </TabsTrigger>
          <TabsTrigger value="members" data-ocid="community.members.tab">
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="p-4 space-y-4">
          {/* Post composer — Tumblr card style */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#E8E8E8] dark:border-zinc-800 shadow-[0_2px_12px_rgba(0,0,0,0.07)] overflow-hidden">
            <div className="p-4 space-y-2">
              <Textarea
                placeholder="Share something with this community..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handlePost();
                  }
                }}
                className="resize-none border-0 p-0 focus-visible:ring-0 text-sm"
                rows={3}
                data-ocid="community.textarea"
              />
              <p className="text-xs text-[#ADB5BD]">Press Ctrl+Enter to post</p>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  className="rounded-full gap-2"
                  onClick={handlePost}
                  data-ocid="community.submit_button"
                >
                  <Send className="h-4 w-4" /> Post
                </Button>
              </div>
            </div>
          </div>

          {visiblePosts.map((post, i) => {
            const isLiked = likedPosts.has(post.id);
            const notesCount = post.likes + (isLiked ? 1 : 0);
            const postComments = comments.filter(
              (c) => c.postId === post.id && c.parentId === null,
            );
            const totalComments = comments.filter(
              (c) => c.postId === post.id,
            ).length;
            const commentsExpanded = expandedComments.has(post.id);
            const initials = post.author
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <div key={post.id}>
                <article
                  className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#E8E8E8] dark:border-zinc-800 shadow-[0_2px_12px_rgba(0,0,0,0.07)] overflow-hidden mb-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.11)] transition-shadow"
                  data-ocid={`community.item.${i + 1}`}
                >
                  {/* Card header */}
                  <div className="flex items-start gap-3 px-4 pt-4 pb-1">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                      <AvatarFallback className="text-xs font-bold bg-[#E8432D]/10 text-[#E8432D]">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[14px] leading-tight">
                        {post.author}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatTime(post.timestamp)}
                      </p>
                    </div>
                    {/* Admin + lock badges in header */}
                    <div className="flex items-center gap-1 shrink-0">
                      {post.isLocked && (
                        <span className="text-[11px] bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <Lock className="h-3 w-3" /> Locked
                        </span>
                      )}
                      {isAdmin && (
                        <>
                          <button
                            type="button"
                            className="h-7 w-7 flex items-center justify-center rounded-full text-[#ADB5BD] hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                            onClick={() => handleLockPost(post.id)}
                            title={post.isLocked ? "Unlock post" : "Lock post"}
                            data-ocid={`community.post.lock.${i + 1}`}
                          >
                            <Lock className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            className="h-7 w-7 flex items-center justify-center rounded-full text-[#ADB5BD] hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                            onClick={() => handleHidePost(post.id)}
                            title="Hide post"
                            data-ocid={`community.post.hide.${i + 1}`}
                          >
                            <EyeOff className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            className="h-7 w-7 flex items-center justify-center rounded-full text-[#ADB5BD] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            onClick={() => handleDeletePost(post.id)}
                            title="Delete post"
                            data-ocid={`community.post.delete.${i + 1}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Post content */}
                  <div className="px-4 py-3">
                    <p className="text-[15px] font-normal leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Attribution line */}
                  <div className="px-4 pb-2 pt-1">
                    <span className="text-[11px] text-muted-foreground">
                      🏛️ Campus
                    </span>
                  </div>

                  {/* Notes count bar */}
                  <div className="px-4 py-1.5 border-t border-[#F0F0F0] dark:border-zinc-800">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {notesCount} {notesCount === 1 ? "note" : "notes"}
                    </span>
                  </div>

                  {/* Engagement footer */}
                  <div className="flex items-center px-3 py-2 border-t border-[#F0F0F0] dark:border-zinc-800">
                    {/* Left cluster */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                          isLiked
                            ? "text-[#E8432D]"
                            : "text-[#ADB5BD] hover:text-[#E8432D]"
                        }`}
                        onClick={() => handleLike(post.id)}
                        data-ocid={`community.post.toggle.${i + 1}`}
                      >
                        <Flame className="h-5 w-5" />
                        <span className="text-base font-bold">
                          {notesCount}
                        </span>
                      </button>

                      {!post.isLocked && (
                        <button
                          type="button"
                          onClick={() => toggleComments(post.id)}
                          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-bold text-[#ADB5BD] hover:text-blue-500 transition-colors"
                        >
                          <MessageCircle className="h-5 w-5" />
                          <span className="text-base font-bold">
                            {totalComments}
                          </span>
                        </button>
                      )}

                      <button
                        type="button"
                        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-bold text-[#ADB5BD] hover:text-[#E8432D] transition-colors"
                      >
                        <ReblogIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Share pushed right */}
                    <button
                      type="button"
                      className="ml-auto flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-bold text-[#ADB5BD] hover:text-[#E8432D] transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </article>

                {/* Threaded comments section */}
                {commentsExpanded && !post.isLocked && (
                  <div className="-mt-2 rounded-b-2xl border border-t-0 border-[#E8E8E8] dark:border-zinc-800 px-4 pb-4 bg-[#FAFAFA] dark:bg-zinc-950">
                    <div className="divide-y divide-[#E5E5E5] dark:divide-zinc-800">
                      {postComments.length === 0 ? (
                        <p className="py-4 text-xs text-center text-[#ADB5BD]">
                          No comments yet. Be the first!
                        </p>
                      ) : (
                        postComments.map((c) => (
                          <ThreadedComment
                            key={c.id}
                            comment={c}
                            allComments={comments}
                            onAddReply={handleAddReply}
                          />
                        ))
                      )}
                    </div>

                    {/* New top-level comment box */}
                    <div className="mt-3 space-y-1">
                      <NewTopLevelComment
                        postId={post.id}
                        onAdd={(content) => {
                          const nc: Comment = {
                            id: `c${Date.now()}`,
                            postId: post.id,
                            author: "You",
                            content,
                            timestamp: new Date(),
                            likes: 0,
                            depth: 0,
                            parentId: null,
                          };
                          setComments((prev) => [...prev, nc]);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="members" className="p-4">
          <div className="space-y-3">
            {MOCK_MEMBERS.map((member, i) => (
              <div
                key={member}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                data-ocid={`community.member.item.${i + 1}`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="font-bold bg-primary/10 text-primary">
                    {member
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-sm">{member}</span>
                {i === 0 && <Badge className="ml-auto text-xs">Admin</Badge>}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Small sub-component for new top-level comment input
function NewTopLevelComment({
  postId: _postId,
  onAdd,
}: {
  postId: string;
  onAdd: (content: string) => void;
}) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onAdd(text);
    setText("");
  };

  return (
    <div className="space-y-1">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Add a comment..."
        className="resize-none text-xs min-h-[48px] rounded-lg"
        rows={2}
      />
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-[#ADB5BD]">Ctrl+Enter to comment</p>
        <Button
          size="sm"
          className="rounded-full h-7 text-xs bg-[#E8432D] hover:bg-[#e8432d]"
          onClick={submit}
        >
          <Send className="h-3 w-3 mr-1" /> Comment
        </Button>
      </div>
    </div>
  );
}
