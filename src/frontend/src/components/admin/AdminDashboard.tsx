import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import { AdminsPanel } from "./panels/AdminsPanel";
import { ConversationsPanel } from "./panels/ConversationsPanel";
import { MarketplacePanel } from "./panels/MarketplacePanel";
import { NotificationsPanel } from "./panels/NotificationsPanel";
import { PostsPanel } from "./panels/PostsPanel";
import { ReportsPanel } from "./panels/ReportsPanel";
import { SupabasePanel } from "./panels/SupabasePanel";
import { UsersPanel } from "./panels/UsersPanel";

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage CLIQ platform content and users
            </p>
          </div>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-6 flex flex-wrap h-auto">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
            <TabsTrigger value="supabase">Supabase</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersPanel />
          </TabsContent>

          <TabsContent value="posts">
            <PostsPanel />
          </TabsContent>

          <TabsContent value="marketplace">
            <MarketplacePanel />
          </TabsContent>

          <TabsContent value="conversations">
            <ConversationsPanel />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsPanel />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsPanel />
          </TabsContent>

          <TabsContent value="admins">
            <AdminsPanel />
          </TabsContent>

          <TabsContent value="supabase">
            <SupabasePanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
