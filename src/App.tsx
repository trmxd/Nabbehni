import { useLayoutEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { LaunchSplash } from './components/LaunchSplash';
import { PageTransition } from './components/PageTransition';
import { AboutPage } from './pages/AboutPage';
import { DemoCompletePage } from './pages/DemoCompletePage';
import { FamilyPage } from './pages/FamilyPage';
import { FingerprintPage } from './pages/FingerprintPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProfilePage } from './pages/ProfilePage';
import { ReviewPage } from './pages/ReviewPage';
import { SettingsPage } from './pages/SettingsPage';
import { SplashPage } from './pages/SplashPage';
import { WatchPage } from './pages/WatchPage';
import { WritingPage } from './pages/WritingPage';

export default function App() {
  const { pathname, search } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  return (
    <>
      <LaunchSplash />
      <Routes>
        <Route path="/" element={<PageTransition><SplashPage /></PageTransition>} />
        <Route path="/choose" element={<PageTransition><ProfilePage /></PageTransition>} />
        <Route path="/demo-complete" element={<PageTransition><DemoCompletePage /></PageTransition>} />
        <Route element={<AppShell />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/write" element={<WritingPage />} />
          <Route path="/fingerprint" element={<FingerprintPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/watch" element={<WatchPage />} />
          <Route path="/family" element={<FamilyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </>
  );
}
