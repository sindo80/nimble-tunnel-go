import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center">
      {/* Background with gradient */}
      <div className="absolute inset-0 gradient-subtle" />
      
      {/* Animated decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            بهترین محصولات دیجیتال و فیزیکی
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-8 leading-tight animate-fade-in">
            <span className="text-foreground">فروشگاه آنلاین</span>
            <span className="block mt-4 text-transparent bg-clip-text gradient-primary bg-gradient-to-l from-primary to-purple-400">
              محصولات با کیفیت
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in">
            دسترسی فوری به هزاران محصول دیجیتال و ارسال سریع محصولات فیزیکی به سراسر ایران با بهترین قیمت و ضمانت اصالت کالا
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button size="lg" className="text-base px-8 py-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300" asChild>
              <Link to="/products">
                مشاهده محصولات
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-xl border-2 hover:bg-primary/5" asChild>
              <Link to="/products?type=digital">
                <Download className="ml-2 h-5 w-5" />
                محصولات دیجیتال
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border/50 animate-fade-in">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">+۱۰۰۰</div>
              <div className="text-sm text-muted-foreground mt-1">محصول متنوع</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">+۵۰۰۰</div>
              <div className="text-sm text-muted-foreground mt-1">مشتری راضی</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">۲۴/۷</div>
              <div className="text-sm text-muted-foreground mt-1">پشتیبانی</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
