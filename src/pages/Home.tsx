import CategoriesSection from '../components/CategoriesSection';
import FeaturedProducts from '../components/FeaturedProducts';
import Hero from '../components/Hero';

export default function Home() {
  return (
    <div className="flex w-full min-w-0 flex-col">
      <Hero />
      <div className="h-2 shrink-0 sm:h-3" aria-hidden />
      <CategoriesSection />
      <FeaturedProducts />
      <div className="shrink-0 pb-6 sm:pb-10" aria-hidden />
    </div>
  );
}
