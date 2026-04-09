import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function AppLayout() {
  return (
    <div className="flex h-full w-full min-h-0 min-w-0 overflow-hidden" style={{ background: '#080d1a' }}>
      <Sidebar />
      {/* pb-16 on mobile so content isn't hidden behind the fixed bottom nav */}
      <main className="flex-1 min-h-0 min-w-0 overflow-auto pb-16 md:pb-0" style={{ background: '#080d1a' }}>
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
