import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { AuthGate } from "./components/auth/AuthGate";
import { AppLayout } from "./components/layout/AppLayout";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { BookmarksPage } from "./pages/BookmarksPage";
import { BoostsPage } from "./pages/BoostsPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CommunityDetailPage } from "./pages/CommunityDetailPage";
import { ConversationPage } from "./pages/ConversationPage";
import { ExplorePage } from "./pages/ExplorePage";
import { HomeFeedPage } from "./pages/HomeFeedPage";
import { ListingDetailPage } from "./pages/ListingDetailPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { MessagesPage } from "./pages/MessagesPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { PostDetailPage } from "./pages/PostDetailPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RoomDetailPage } from "./pages/RoomDetailPage";
import { RoomiePage } from "./pages/RoomiePage";
import { RoomsPage } from "./pages/RoomsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { UserProfilePage } from "./pages/UserProfilePage";
import { AdminPage } from "./pages/admin/AdminPage";

function RootComponent() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return <AuthGate>{isAuthenticated ? <AppLayout /> : null}</AuthGate>;
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeFeedPage,
});

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/explore",
  component: ExplorePage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: NotificationsPage,
});

const bookmarksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bookmarks",
  component: BookmarksPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const userProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/$username",
  component: UserProfilePage,
});

const postDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/post/$postId",
  component: PostDetailPage,
});

const marketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marketplace",
  component: MarketplacePage,
});

const listingDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marketplace/$listingId",
  component: ListingDetailPage,
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/messages",
  component: MessagesPage,
});

const conversationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/messages/$conversationId",
  component: ConversationPage,
});

const communitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/communities",
  component: CommunitiesPage,
});

const communityDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/communities/$communityId",
  component: CommunityDetailPage,
});

const roomsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rooms",
  component: RoomsPage,
});

const roomDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rooms/$roomId",
  component: RoomDetailPage,
});

const roomieRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/roomie",
  component: RoomiePage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const boostsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/boosts",
  component: BoostsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  exploreRoute,
  notificationsRoute,
  bookmarksRoute,
  profileRoute,
  userProfileRoute,
  postDetailRoute,
  marketplaceRoute,
  listingDetailRoute,
  messagesRoute,
  conversationRoute,
  communitiesRoute,
  communityDetailRoute,
  roomsRoute,
  roomDetailRoute,
  roomieRoute,
  settingsRoute,
  adminRoute,
  boostsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
