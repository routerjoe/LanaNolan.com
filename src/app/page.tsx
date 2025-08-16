import Layout from '../components/layout/Layout';
import Hero from '../components/sections/Hero';
import PlayerProfile from '../components/sections/PlayerProfile';
import VideoGallery from '../components/sections/VideoGallery';
import Schedule from '../components/sections/Schedule';
import Blog from '../components/sections/Blog';
import Contact from '../components/sections/Contact';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <PlayerProfile />
      <VideoGallery />
      <Schedule />
      

      <Blog />
      <Contact />
    </Layout>
  );
}
