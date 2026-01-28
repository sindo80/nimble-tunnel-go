import { Download, Truck, Shield, Headphones } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Download,
    title: 'دانلود فوری',
    description: 'پس از خرید، فایل‌های دیجیتال فوراً قابل دانلود هستند',
  },
  {
    icon: Truck,
    title: 'ارسال سریع',
    description: 'ارسال محصولات فیزیکی به سراسر کشور در کوتاه‌ترین زمان',
  },
  {
    icon: Shield,
    title: 'خرید امن',
    description: 'پرداخت امن با درگاه‌های معتبر و گارانتی بازگشت وجه',
  },
  {
    icon: Headphones,
    title: 'پشتیبانی ۲۴/۷',
    description: 'تیم پشتیبانی ما همیشه آماده پاسخگویی به سوالات شماست',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
