import { useEffect, useState } from 'react';
import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import BrandStory from '../components/sections/BrandStory.jsx';
import FeaturedCollection from '../components/sections/FeaturedCollection.jsx';
import LimitedDrop from '../components/sections/LimitedDrop.jsx';
import LuxuryHero from '../components/sections/LuxuryHero.jsx';
import NewsletterSection from '../components/sections/NewsletterSection.jsx';
import LandingPage from './LandingPage.jsx';
import { getPublicSettings } from '../services/settingsApi.js';

function Home() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getPublicSettings();
        setSettings(data);
      } catch {
        setSettings(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
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
      <LimitedDrop />
      <BrandStory />
      <NewsletterSection />
      </AnimatedPage>
  );
}

export default Home;
