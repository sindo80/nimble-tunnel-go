import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import forexLogo from '@/assets/forex-logo.jpg';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center gradient-forex chart-pattern">
      {/* Background with logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <img src={forexLogo} alt="" className="w-[800px] h-[800px] object-cover blur-sm" />
      </div>
      
      {/* Animated decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-destructive/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src={forexLogo} 
              alt="فارکس سیگنال" 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-2xl trading-glow border-4 border-primary/30"
            />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in border border-primary/20">
            <TrendingUp className="h-4 w-4" />
            سیگنال‌های معاملاتی با دقت بالا
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-8 leading-tight animate-fade-in">
            <span className="text-foreground">فارکس سیگنال</span>
            <span className="block mt-4 text-transparent bg-clip-text bg-gradient-to-l from-primary to-emerald-300">
              مسیر موفقیت در معاملات
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in">
            دسترسی به سیگنال‌های معاملاتی حرفه‌ای فارکس و ارز دیجیتال با تحلیل تکنیکال و فاندامنتال دقیق. آموزش‌ها، ربات‌ها و اندیکاتورهای اختصاصی
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button size="lg" className="text-base px-8 py-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300" asChild>
              <Link to="/products">
                مشاهده سیگنال‌ها
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-xl border-2 border-primary/30 hover:bg-primary/10" asChild>
              <Link to="/products?type=digital">
                <BarChart3 className="ml-2 h-5 w-5" />
                آموزش و ابزارها
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border/50 animate-fade-in">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">+۸۵%</div>
              <div className="text-sm text-muted-foreground mt-1">دقت سیگنال‌ها</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">+۵۰۰۰</div>
              <div className="text-sm text-muted-foreground mt-1">معامله‌گر فعال</div>
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
