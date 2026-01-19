import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { LegalTokusho } from './pages/LegalTokusho';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { RoutePath } from './types';

// Scroll to top wrapper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path={RoutePath.HOME} element={<Home />} />
          <Route path={RoutePath.LEGAL_TOKUSHO} element={<LegalTokusho />} />
          <Route path={RoutePath.PRIVACY} element={<PrivacyPolicy />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;