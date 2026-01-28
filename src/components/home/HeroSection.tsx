import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/20">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            فروشگاه آنلاین
            <span className="text-primary block mt-2">محصولات دیجیتال و فیزیکی</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            بهترین محصولات دیجیتال و فیزیکی با کیفیت بالا و قیمت مناسب. خرید امن، دانلود فوری فایل‌ها و ارسال سریع محصولات فیزیکی.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/products">
                مشاهده محصولات
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/products?type=digital">
                <Download className="ml-2 h-5 w-5" />
                محصولات دیجیتال
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full translate-x-1/3 translate-y-1/3" />
    </section>
  );
}
