import { Link } from 'react-router-dom';
import { Package, Instagram, Twitter, MessageCircle, Shield, Truck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-500 rounded-xl flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">فروشگاه</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              فروشگاه آنلاین محصولات دیجیتال و فیزیکی با کیفیت بالا و قیمت مناسب. خرید امن و تحویل سریع.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                <Twitter className="h-5 w-5" />
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
                  محصولات دیجیتال
                </Link>
              </li>
              <li>
                <Link to="/products?type=physical" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full" />
                  محصولات فیزیکی
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
            <h3 className="font-bold mb-5">امکانات</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-emerald-500" />
                </div>
                <span>خرید امن و مطمئن</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Truck className="h-4 w-4 text-blue-500" />
                </div>
                <span>ارسال سریع به سراسر ایران</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-purple-500" />
                </div>
                <span>پشتیبانی ۲۴ ساعته</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground">© ۱۴۰۴ فروشگاه. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
