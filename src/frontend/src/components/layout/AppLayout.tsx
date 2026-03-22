import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  Bell,
  Bookmark,
  ChevronRight,
  Diamond,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Rocket,
  Search,
  Settings,
  Shield,
  ShoppingBag,
  Skull,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { clearMockUser, getMockUser } from "../../hooks/useMockAuth";
import { useGetUnreadNotificationCount } from "../../hooks/useNotifications";

export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { data: unreadCount } = useGetUnreadNotificationCount();

  const user = getMockUser();
  const initials =
    user?.displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";

  const handleLogout = () => {
    clearMockUser();
    navigate({ to: "/signin" });
    window.location.reload();
  };

  const bottomNavItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/explore", icon: Search, label: "Explore" },
    { path: "/marketplace", icon: ShoppingBag, label: "Market" },
    {
      path: "/notifications",
      icon: Bell,
      label: "Notifs",
      badge: unreadCount ? Number(unreadCount) : 0,
    },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const sideNavItems = [
    { path: "/messages", icon: MessageCircle, label: "Messages" },
    { path: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
    { path: "/communities", icon: Users, label: "Communities" },
    { path: "/rooms", icon: Skull, label: "Anonymous Rooms" },
    { path: "/roomie", icon: Home, label: "Roomie Matching" },
    { path: "/boosts", icon: Rocket, label: "My Boosts" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  const desktopNavItems = [
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
    { path: "/communities", icon: Users, label: "Communities" },
    { path: "/rooms", icon: Skull, label: "Anonymous Rooms" },
    { path: "/roomie", icon: Home, label: "Roomie" },
    { path: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
    { path: "/boosts", icon: Rocket, label: "My Boosts" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/admin", icon: Shield, label: "Admin" },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:border-r md:bg-card">
        <div className="flex items-center gap-3 border-b p-6">
          <img
            src="/assets/uploads/IMG-20260226-WA0003-1.jpg"
            alt="CLIQ"
            className="h-10 w-10"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="text-2xl font-black tracking-tight">CLIQ</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="flex flex-col gap-1">
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 text-sm font-semibold rounded-xl h-11",
                    )}
                    data-ocid={`nav.${item.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {(item as any).badge !== undefined &&
                      (item as any).badge > 0 && (
                        <Badge
                          variant="destructive"
                          className="ml-auto font-bold text-xs"
                        >
                          {(item as any).badge}
                        </Badge>
                      )}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="border-t p-4 space-y-2">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted mb-2">
              <Avatar className="h-9 w-9 border border-primary">
                <AvatarFallback className="font-semibold bg-primary text-primary-foreground text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">
                  {user.displayName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  @{user.username}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 p-2">
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
              data-ocid="settings.switch"
            />
            <span className="text-sm font-semibold">
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sm font-semibold rounded-xl h-11 text-destructive hover:text-destructive"
            onClick={handleLogout}
            data-ocid="nav.logout_button"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/50 cursor-default"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r flex flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border border-primary">
                  <AvatarFallback className="font-semibold bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">
                    {user?.displayName ?? "Guest"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @{user?.username ?? "guest"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDrawerOpen(false)}
                data-ocid="drawer.close_button"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* University badge */}
            {user?.university && (
              <div className="px-4 py-2 bg-primary/10">
                <span className="text-xs font-semibold text-primary">
                  🏛️ {user.university}
                </span>
              </div>
            )}

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto p-3">
              <nav className="flex flex-col gap-1">
                {sideNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className="w-full justify-between gap-3 text-sm font-semibold rounded-xl h-11"
                        data-ocid={`drawer.${item.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </span>
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      </Button>
                    </Link>
                  );
                })}
                <Link to="/admin" onClick={() => setDrawerOpen(false)}>
                  <Button
                    variant={currentPath === "/admin" ? "default" : "ghost"}
                    className="w-full justify-between gap-3 text-sm font-semibold rounded-xl h-11"
                  >
                    <span className="flex items-center gap-3">
                      <Shield className="h-5 w-5" /> Admin
                    </span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Button>
                </Link>
              </nav>

              <Separator className="my-3" />

              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-sm font-semibold rounded-xl h-11"
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate({ to: "/settings" });
                  }}
                >
                  <Diamond className="h-5 w-5 text-primary" />
                  Upgrade Premium
                </Button>
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
                  {theme === "dark" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                  <span className="text-sm font-semibold">Dark Mode</span>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
                    className="ml-auto"
                    data-ocid="drawer.dark_mode.switch"
                  />
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-sm font-semibold rounded-xl h-11 text-destructive hover:text-destructive"
                  onClick={() => {
                    setDrawerOpen(false);
                    handleLogout();
                  }}
                  data-ocid="drawer.logout_button"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0 min-h-0">
        {/* Mobile Top Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-card border-b md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDrawerOpen(true)}
            data-ocid="nav.menu_button"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <img
              src="/assets/uploads/IMG-20260226-WA0003-1.jpg"
              alt="CLIQ"
              className="h-7 w-7"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="text-xl font-black tracking-tight">CLIQ</span>
          </div>
          <Link to="/notifications">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              data-ocid="nav.notifications.link"
            >
              <Bell className="h-6 w-6" />
              {unreadCount && Number(unreadCount) > 0 ? (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center">
                  {Number(unreadCount)}
                </span>
              ) : null}
            </Button>
          </Link>
        </div>

        <div className="mx-auto max-w-2xl">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t bg-card md:hidden shadow-sm">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link key={item.path} to={item.path} className="flex-1">
              <button
                type="button"
                className={cn(
                  "flex w-full flex-col items-center gap-0.5 py-2 px-1 text-xs font-semibold transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
                data-ocid={`nav.${item.label.toLowerCase()}.link`}
              >
                <div className="relative">
                  <Icon
                    className={cn("h-6 w-6", isActive && "fill-primary/20")}
                  />
                  {(item as any).badge !== undefined &&
                    (item as any).badge > 0 && (
                      <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                        {(item as any).badge}
                      </span>
                    )}
                </div>
                <span className="leading-none">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
