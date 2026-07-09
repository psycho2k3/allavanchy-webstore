import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import BrandStory from '../components/sections/BrandStory.jsx';
import FeaturedCollection from '../components/sections/FeaturedCollection.jsx';
import InstagramGallery from '../components/sections/InstagramGallery.jsx';
import LimitedDrop from '../components/sections/LimitedDrop.jsx';
import LuxuryHero from '../components/sections/LuxuryHero.jsx';
import NewArrivals from '../components/sections/NewArrivals.jsx';
import NewsletterSection from '../components/sections/NewsletterSection.jsx';

function Home() {
  return (
    <AnimatedPage>
      <LuxuryHero />
      <FeaturedCollection />
      <NewArrivals />
      <LimitedDrop />
      <BrandStory />
      <NewsletterSection />
      <InstagramGallery />
    </AnimatedPage>
  );
}

export default Home;
