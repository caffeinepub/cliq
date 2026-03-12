import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Bookmark,
  Home,
  MessageCircle,
  Search,
  Shield,
  ShoppingBag,
  Ticket,
  User,
} from "lucide-react";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { useGetUnreadNotificationCount } from "../../hooks/useNotifications";

export function PrimaryNav() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { data: unreadCount } = useGetUnreadNotificationCount();
  const { isAdmin } = useAdminAuth();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/explore", icon: Search, label: "Explore" },
    {
      path: "/notifications",
      icon: Bell,
      label: "Notifications",
      badge: unreadCount ? Number(unreadCount) : 0,
    },
    { path: "/marketplace", icon: ShoppingBag, label: "Marketplace" },
    { path: "/messages", icon: MessageCircle, label: "Messages" },
    { path: "/tickets", icon: Ticket, label: "Tickets" },
    { path: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  if (isAdmin) {
    navItems.push({ path: "/admin", icon: Shield, label: "Admin" });
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex md:flex-col md:gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-4 text-base font-bold rounded-2xl h-14",
                  isActive && "shadow-bold",
                )}
              >
                <Icon className="h-6 w-6" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge variant="destructive" className="ml-auto font-bold">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t-2 bg-card md:hidden overflow-x-auto shadow-bold">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link key={item.path} to={item.path} className="flex-1 min-w-0">
              <Button
                variant="ghost"
                className={cn(
                  "relative h-16 w-full rounded-none",
                  isActive && "bg-primary/10 text-primary",
                )}
              >
                <div className="flex flex-col items-center gap-1">
                  <Icon className={cn("h-6 w-6", isActive && "stroke-[2.5]")} />
                  <span
                    className={cn("text-xs truncate", isActive && "font-bold")}
                  >
                    {item.label}
                  </span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute right-1/4 top-2 h-5 min-w-5 px-1.5 text-[10px] font-bold"
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
