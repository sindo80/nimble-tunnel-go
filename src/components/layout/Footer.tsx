import { Link } from 'react-router-dom';
import { TrendingUp, Instagram, Send, MessageCircle, Shield, Zap } from 'lucide-react';
import forexLogo from '@/assets/forex-logo.jpg';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border/50 mt-auto">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img src={forexLogo} alt="فارکس سیگنال" className="w-12 h-12 rounded-full border-2 border-primary/30" />
              <span className="text-xl font-bold">فارکس سیگنال</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              ارائه دهنده سیگنال‌های معاملاتی حرفه‌ای فارکس و ارز دیجیتال. آموزش، تحلیل و ابزارهای معاملاتی برای موفقیت در بازارهای مالی.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-5">دسترسی سریع</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full" />
                  همه محصولات
                </Link>
              </li>
              <li>
                <Link to="/products?type=digital" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full" />
                  سیگنال‌های معاملاتی
                </Link>
              </li>
              <li>
                <Link to="/products?type=physical" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full" />
                  آموزش‌ها و دوره‌ها
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold mb-5">خدمات مشتریان</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/support" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full" />
                  پشتیبانی تیکت
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full" />
                  سوالات متداول
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full" />
                  قوانین و مقررات
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-bold mb-5">مزایای ما</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <span>سیگنال‌های با دقت +۸۵٪</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-destructive" />
                </div>
                <span>ارسال آنی سیگنال‌ها</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                </div>
                <span>پشتیبانی ۲۴ ساعته</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground">© ۱۴۰۴ فارکس سیگنال. تمامی حقوق محفوظ است.</p>
          <p className="text-xs text-muted-foreground mt-2">هشدار: معامله در بازارهای مالی دارای ریسک است. سرمایه‌گذاری با مسئولیت شما انجام می‌شود.</p>
        </div>
      </div>
    </footer>
  );
}
