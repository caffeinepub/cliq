import { Link, useRouterState } from '@tanstack/react-router';
import { Home, Search, Bell, Bookmark, User, ShoppingBag, MessageCircle, Ticket, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useGetUnreadNotificationCount } from '../../hooks/useNotifications';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export function PrimaryNav() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { data: unreadCount } = useGetUnreadNotificationCount();
  const { isAdmin } = useAdminAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Search, label: 'Explore' },
    { path: '/notifications', icon: Bell, label: 'Notifications', badge: unreadCount ? Number(unreadCount) : 0 },
    { path: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/tickets', icon: Ticket, label: 'Tickets' },
    { path: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin', icon: Shield, label: 'Admin' });
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex md:flex-col md:gap-2 md:p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-4 text-base',
                  isActive && 'font-semibold'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t bg-background md:hidden overflow-x-auto">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link key={item.path} to={item.path} className="flex-1 min-w-0">
              <Button
                variant="ghost"
                className={cn(
                  'relative h-16 w-full rounded-none',
                  isActive && 'text-primary'
                )}
              >
                <div className="flex flex-col items-center gap-1">
                  <Icon className="h-5 w-5" />
                  <span className="text-xs truncate">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute right-1/4 top-2 h-4 min-w-4 px-1 text-[10px]"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </Button>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
