import { useEffect, useState } from 'react';
import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import FeaturedCollection from '../components/sections/FeaturedCollection.jsx';
import FeaturedProducts from '../components/sections/FeaturedProducts.jsx';
import LuxuryHero from '../components/sections/LuxuryHero.jsx';
import LandingPage from './LandingPage.jsx';
import { getPublicSettings } from '../services/settingsApi.js';

function Home() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const data = await getPublicSettings();
        if (isMounted) setSettings(data);
      } catch {
        if (isMounted) setSettings(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-allavanchy-ivory" />;
  }

  if (settings?.site_mode === 'landing') {
    return <LandingPage settings={settings} />;
  }

  return (
    <AnimatedPage>
      <LuxuryHero settings={settings} />
      <FeaturedCollection />
      <FeaturedProducts />
    </AnimatedPage>
  );
}

export default Home;
