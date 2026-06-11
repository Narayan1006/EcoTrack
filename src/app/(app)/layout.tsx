// Layout for all inner app pages — includes sidebar navigation
import Sidebar from '@/ui/components/layout/Sidebar';
import StoreInitializer from '@/ui/components/StoreInitializer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StoreInitializer />
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </>
  );
}
