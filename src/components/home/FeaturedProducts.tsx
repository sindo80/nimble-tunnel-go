import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useProducts } from '@/hooks/useProducts';

export function FeaturedProducts() {
  const { products, loading } = useProducts({ featured: true, limit: 8 });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">محصولات ویژه</h2>
            <p className="text-muted-foreground mt-1">برترین محصولات فروشگاه</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/products">
              مشاهده همه
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ProductGrid products={products} loading={loading} />
      </div>
    </section>
  );
}
