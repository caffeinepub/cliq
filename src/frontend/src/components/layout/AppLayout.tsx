import { Outlet } from '@tanstack/react-router';
import { PrimaryNav } from '../nav/PrimaryNav';
import { AuthButton } from '../auth/AuthButton';

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r">
        <div className="flex items-center gap-3 border-b p-4">
          <img src="/assets/generated/cliq-logo.dim_512x512.png" alt="CLIQ" className="h-8 w-8" />
          <span className="text-xl font-bold">CLIQ</span>
        </div>
        <div className="flex-1">
          <PrimaryNav />
        </div>
        <div className="border-t p-4">
          <AuthButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-16 md:pb-0">
        <div className="mx-auto max-w-2xl">
          <Outlet />
        </div>
      </main>

      {/* Mobile Nav */}
      <PrimaryNav />
    </div>
  );
}
