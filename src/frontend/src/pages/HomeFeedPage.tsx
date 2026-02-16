import { useState } from 'react';
import { PostComposer } from '../components/posts/PostComposer';
import { PostCard } from '../components/posts/PostCard';
import { useGetCallerUserProfile, useGetFollowingFeed, useGetCampusFeed, useGetUniversalFeed } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export function HomeFeedPage() {
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const [activeTab, setActiveTab] = useState<'following' | 'campus' | 'universal'>('campus');

  const { data: followingFeed, isLoading: followingLoading } = useGetFollowingFeed();
  const { data: campusFeed, isLoading: campusLoading } = useGetCampusFeed();
  const { data: universalFeed, isLoading: universalLoading } = useGetUniversalFeed();

  if (profileLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentFeed = activeTab === 'following' ? followingFeed : activeTab === 'campus' ? campusFeed : universalFeed;
  const isLoading = activeTab === 'following' ? followingLoading : activeTab === 'campus' ? campusLoading : universalLoading;

  return (
    <div className="space-y-4 p-4">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">Home</h1>
        <p className="text-sm text-muted-foreground">{profile?.university}</p>
      </div>

      <PostComposer />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="campus">Campus</TabsTrigger>
          <TabsTrigger value="universal">Universal</TabsTrigger>
        </TabsList>

        <TabsContent value="following" className="space-y-4 mt-4">
          {followingLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : followingFeed && followingFeed.length > 0 ? (
            followingFeed.map((post) => <PostCard key={post.id.toString()} post={post} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <img
                src="/assets/generated/empty-feed.dim_1200x800.png"
                alt="No posts yet"
                className="mb-6 max-w-md rounded-lg opacity-75"
              />
              <h2 className="mb-2 text-xl font-semibold">No posts yet</h2>
              <p className="text-muted-foreground">
                Follow other users to see their posts here!
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="campus" className="space-y-4 mt-4">
          {campusLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : campusFeed && campusFeed.length > 0 ? (
            campusFeed.map((post) => <PostCard key={post.id.toString()} post={post} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <img
                src="/assets/generated/empty-feed.dim_1200x800.png"
                alt="No posts yet"
                className="mb-6 max-w-md rounded-lg opacity-75"
              />
              <h2 className="mb-2 text-xl font-semibold">No posts yet</h2>
              <p className="text-muted-foreground">
                Be the first to share something with your campus community!
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="universal" className="space-y-4 mt-4">
          {universalLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : universalFeed && universalFeed.length > 0 ? (
            universalFeed.map((post) => <PostCard key={post.id.toString()} post={post} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <img
                src="/assets/generated/empty-feed.dim_1200x800.png"
                alt="No posts yet"
                className="mb-6 max-w-md rounded-lg opacity-75"
              />
              <h2 className="mb-2 text-xl font-semibold">No posts yet</h2>
              <p className="text-muted-foreground">
                Be the first to share something across universities!
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
