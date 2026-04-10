import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Navbar />
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
