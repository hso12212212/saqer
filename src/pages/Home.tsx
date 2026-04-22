import CategoriesSection from '../components/CategoriesSection';
import CtaBanner from '../components/CtaBanner';
import FeaturedProducts from '../components/FeaturedProducts';
import Hero from '../components/Hero';

export default function Home() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <FeaturedProducts />
      <CtaBanner />
    </>
  );
}
