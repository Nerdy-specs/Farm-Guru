import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomTabs from '@/components/BottomTabs';
import NotFound from '@/pages/NotFound';
import { AnimatePresence, motion } from 'framer-motion';

// Eager-load high-traffic pages
import HomePage from '@/pages/HomePage';
import QueryPage from '@/pages/QueryPage';
import WeatherPage from '@/pages/WeatherPage';
import MarketPage from '@/pages/MarketPage';
import SchemesPage from '@/pages/SchemesPage';
import CommunityPage from '@/pages/CommunityPage';
import ProfilePage from '@/pages/ProfilePage';
import AboutPage from '@/pages/AboutPage';

// Lazy-load heavy/low-frequency pages to keep initial bundle lean
const DiagnosticsPage = lazy(() => import('@/pages/DiagnosticsPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));

const PageLayout = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-gradient-sky relative">
      {/* Decorative background accents */}
      <div className="pointer-events-none select-none absolute inset-0 opacity-10">
        <div className="bg-leaf-top-right" />
        <div className="bg-leaf-bottom-left" />
      </div>

      <Header />

      <main className="px-4 pb-24 sm:pb-16">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />

      {/* Mobile bottom tabs */}
      <div className="md:hidden">
        <BottomTabs />
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PageLayout />}> 
        <Route path="/" element={<HomePage />} />
        <Route path="/query" element={<QueryPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/schemes" element={<SchemesPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/diagnostics"
          element={
            <Suspense fallback={<div className="p-6 text-center">Loading diagnostics…</div>}>
              <DiagnosticsPage />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<div className="p-6 text-center">Loading admin…</div>}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;