import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar.jsx';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';

function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-allavanchy-ivory text-allavanchy-ink">
      <AnnouncementBar />
      <Navbar />
      <main className="-mt-[73px] pt-[73px]">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
