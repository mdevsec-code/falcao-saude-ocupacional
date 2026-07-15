import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

export function AppShell() {
  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-[auto_1fr]">
      <Sidebar />
      <div className="flex min-h-0 flex-col">
        <Topbar />
        <main className="scrollbar-thin flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
