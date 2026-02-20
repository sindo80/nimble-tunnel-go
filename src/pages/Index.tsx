import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CategorySection } from '@/components/home/CategorySection';
import { TutorialsShowcase } from '@/components/home/TutorialsShowcase';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <FeaturedProducts />
      <TutorialsShowcase />
      <CategorySection />
    </Layout>
  );
};

export default Index;
