import { Link } from 'react-router-dom';
import { Download, Package, FolderOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useCategories } from '@/hooks/useCategories';

export function CategorySection() {
  const { categories, loading } = useCategories();

  const productTypes = [
    {
      title: 'محصولات دیجیتال',
      description: 'فایل‌ها، نرم‌افزارها، دوره‌های آموزشی و...',
      icon: Download,
      href: '/products?type=digital',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'محصولات فیزیکی',
      description: 'کالاهای قابل ارسال با پست و پیک',
      icon: Package,
      href: '/products?type=physical',
      color: 'bg-green-500/10 text-green-600',
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">دسته‌بندی محصولات</h2>
          <p className="text-muted-foreground">محصول مورد نظر خود را سریع‌تر پیدا کنید</p>
        </div>

        {/* Product Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {productTypes.map((type) => (
            <Link key={type.title} to={type.href}>
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`p-4 rounded-xl ${type.color}`}>
                    <type.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{type.title}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category) => (
              <Link key={category.id} to={`/products?category=${category.slug}`}>
                <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="flex flex-col items-center p-4 text-center">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-12 h-12 object-cover rounded-full mb-3"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                        <FolderOpen className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    <h3 className="text-sm font-medium">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
