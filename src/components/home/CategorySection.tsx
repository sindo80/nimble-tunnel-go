import { Link } from 'react-router-dom';
import { Download, Package, FolderOpen, ArrowUpLeft } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';

export function CategorySection() {
  const { categories, loading } = useCategories();

  const productTypes = [
    {
      title: 'محصولات دیجیتال',
      description: 'فایل‌ها، نرم‌افزارها، دوره‌های آموزشی و کتاب‌های الکترونیکی',
      icon: Download,
      href: '/products?type=digital',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-500/10 to-indigo-600/10',
    },
    {
      title: 'محصولات فیزیکی',
      description: 'کالاهای قابل ارسال با پست و پیک به سراسر کشور',
      icon: Package,
      href: '/products?type=physical',
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-500/10 to-teal-600/10',
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">دسته‌بندی محصولات</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            محصول مورد نظر خود را از بین دسته‌بندی‌ها سریع‌تر پیدا کنید
          </p>
        </div>

        {/* Product Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {productTypes.map((type) => (
            <Link key={type.title} to={type.href} className="group">
              <div className={`relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${type.bgGradient} border border-border/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1`}>
                {/* Background decoration */}
                <div className={`absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br ${type.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                
                <div className="relative flex items-start gap-5">
                  <div className={`shrink-0 w-16 h-16 bg-gradient-to-br ${type.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <type.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xl">{type.title}</h3>
                      <ArrowUpLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-muted-foreground mt-2 leading-relaxed">{type.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category) => (
              <Link key={category.id} to={`/products?category=${category.slug}`}>
                <div className="group bg-card rounded-xl p-5 text-center border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-14 h-14 object-cover rounded-full mx-auto mb-3 ring-2 ring-border group-hover:ring-primary transition-colors"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                      <FolderOpen className="h-7 w-7 text-primary" />
                    </div>
                  )}
                  <h3 className="text-sm font-medium group-hover:text-primary transition-colors">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
