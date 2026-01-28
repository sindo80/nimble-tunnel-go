import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Download, Package, Share2, ChevronRight, Minus, Plus, Check, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Layout } from '@/components/layout/Layout';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(slug || '');
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-10 bg-muted rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">محصول یافت نشد</h1>
          <Button onClick={() => navigate('/products')}>بازگشت به محصولات</Button>
        </div>
      </Layout>
    );
  }

  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
    : 0;

  const images = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean) as string[];

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => navigate('/')}>خانه</button>
          <ChevronRight className="h-4 w-4" />
          <button onClick={() => navigate('/products')}>محصولات</button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-xl bg-muted">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {hasDiscount && (
                  <Badge variant="destructive" className="text-sm">
                    {discountPercent}% تخفیف
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className={cn(
                    product.product_type === 'digital' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  )}
                >
                  {product.product_type === 'digital' ? (
                    <><Download className="h-3 w-3 ml-1" /> دیجیتال</>
                  ) : (
                    <><Package className="h-3 w-3 ml-1" /> فیزیکی</>
                  )}
                </Badge>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors",
                      selectedImage === idx ? "border-primary" : "border-transparent"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
              {product.short_description && (
                <p className="text-muted-foreground">{product.short_description}</p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              {hasDiscount ? (
                <>
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(product.discount_price!)} تومان
                  </span>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.price)} تومان
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold">
                  {formatPrice(product.price)} تومان
                </span>
              )}
            </div>

            <Separator />

            {/* Stock / Availability */}
            <div className="flex items-center gap-2">
              {product.product_type === 'digital' ? (
                <>
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-green-600">قابل دانلود فوری</span>
                </>
              ) : product.stock_quantity > 0 ? (
                <>
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-green-600">موجود در انبار ({product.stock_quantity} عدد)</span>
                </>
              ) : (
                <span className="text-red-500">ناموجود</span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              {product.product_type === 'physical' && (
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    disabled={quantity >= product.stock_quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.product_type === 'physical' && product.stock_quantity === 0}
              >
                <ShoppingCart className="h-5 w-5 ml-2" />
                افزودن به سبد خرید
              </Button>

              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Shipping Info */}
            {product.product_type === 'physical' && (
              <Card>
                <CardContent className="flex items-center gap-3 py-4">
                  <Truck className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">ارسال به سراسر کشور</p>
                    <p className="text-sm text-muted-foreground">ارسال رایگان برای خریدهای بالای ۵۰۰ هزار تومان</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {product.product_type === 'digital' && (
              <Card>
                <CardContent className="flex items-center gap-3 py-4">
                  <Download className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">دانلود فوری</p>
                    <p className="text-sm text-muted-foreground">بلافاصله پس از پرداخت، لینک دانلود فعال می‌شود</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mt-12">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">توضیحات</TabsTrigger>
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <TabsTrigger value="specs">مشخصات</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <div className="prose prose-gray max-w-none">
              {product.description || 'توضیحی برای این محصول ثبت نشده است.'}
            </div>
          </TabsContent>
          {product.specifications && (
            <TabsContent value="specs" className="mt-6">
              <div className="grid gap-4 max-w-2xl">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex border-b pb-2">
                    <span className="font-medium w-1/3">{key}</span>
                    <span className="text-muted-foreground w-2/3">{value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
}
