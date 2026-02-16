import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { AuthGate } from './components/auth/AuthGate';
import { AppLayout } from './components/layout/AppLayout';
import { HomeFeedPage } from './pages/HomeFeedPage';
import { ExplorePage } from './pages/ExplorePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { ProfilePage } from './pages/ProfilePage';
import { PostDetailPage } from './pages/PostDetailPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { MessagesPage } from './pages/MessagesPage';
import { ConversationPage } from './pages/ConversationPage';
import { TicketsPage } from './pages/TicketsPage';
import { TicketEventDetailPage } from './pages/TicketEventDetailPage';
import { TicketMarketplacePage } from './pages/TicketMarketplacePage';
import { TicketMarketplaceEventDetailPage } from './pages/TicketMarketplaceEventDetailPage';
import { AdminPage } from './pages/admin/AdminPage';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

function RootComponent() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <AuthGate>
      {isAuthenticated ? <AppLayout /> : null}
    </AuthGate>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeFeedPage,
});

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explore',
  component: ExplorePage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: NotificationsPage,
});

const bookmarksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bookmarks',
  component: BookmarksPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const postDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/post/$postId',
  component: PostDetailPage,
});

const marketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/marketplace',
  component: MarketplacePage,
});

const listingDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/marketplace/$listingId',
  component: ListingDetailPage,
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages',
  component: MessagesPage,
});

const conversationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages/$conversationId',
  component: ConversationPage,
});

const ticketsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tickets',
  component: TicketsPage,
});

const ticketEventDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tickets/$eventId',
  component: TicketEventDetailPage,
});

const ticketMarketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/marketplace/tickets',
  component: TicketMarketplacePage,
});

const ticketMarketplaceEventDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/marketplace/tickets/$eventId',
  component: TicketMarketplaceEventDetailPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  exploreRoute,
  notificationsRoute,
  bookmarksRoute,
  profileRoute,
  postDetailRoute,
  marketplaceRoute,
  listingDetailRoute,
  messagesRoute,
  conversationRoute,
  ticketsRoute,
  ticketEventDetailRoute,
  ticketMarketplaceRoute,
  ticketMarketplaceEventDetailRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
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
