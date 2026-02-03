import { Download, Truck, Shield, Headphones } from 'lucide-react';

const features = [
  {
    icon: Download,
    title: 'دانلود فوری',
    description: 'پس از خرید، فایل‌های دیجیتال فوراً قابل دانلود هستند',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Truck,
    title: 'ارسال سریع',
    description: 'ارسال محصولات فیزیکی به سراسر کشور در کوتاه‌ترین زمان',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Shield,
    title: 'خرید امن',
    description: 'پرداخت امن با درگاه‌های معتبر و گارانتی بازگشت وجه',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Headphones,
    title: 'پشتیبانی ۲۴/۷',
    description: 'تیم پشتیبانی ما همیشه آماده پاسخگویی به سوالات شماست',
    gradient: 'from-orange-500 to-amber-500',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">چرا ما را انتخاب کنید؟</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            ما با ارائه بهترین خدمات، تجربه خریدی امن و لذت‌بخش برای شما فراهم می‌کنیم
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-card rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-border/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
              
              <div className={`relative mx-auto w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              
              <h3 className="font-bold text-lg mb-2 text-center">{feature.title}</h3>
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
