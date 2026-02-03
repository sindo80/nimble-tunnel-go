import { Link } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useProducts } from '@/hooks/useProducts';

export function FeaturedProducts() {
  const { products, loading } = useProducts({ featured: true, limit: 8 });

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">محصولات ویژه</h2>
              <p className="text-muted-foreground mt-1">برترین و پرفروش‌ترین محصولات فروشگاه</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-xl border-2 group" asChild>
            <Link to="/products">
              مشاهده همه محصولات
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
        
        <ProductGrid products={products} loading={loading} />
      </div>
    </section>
  );
}
