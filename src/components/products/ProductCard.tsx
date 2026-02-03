import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Download, Package } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/database';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-border/50 bg-card">
      <Link to={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-muted/50">
              <Package className="h-16 w-16 text-muted-foreground/50" />
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {hasDiscount && (
              <Badge className="bg-destructive text-destructive-foreground shadow-lg text-xs font-bold">
                {discountPercent}% تخفیف
              </Badge>
            )}
            <Badge
              className={cn(
                "shadow-lg text-xs font-medium",
                product.product_type === 'digital' 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              )}
            >
              {product.product_type === 'digital' ? (
                <><Download className="h-3 w-3 ml-1" /> دیجیتال</>
              ) : (
                <><Package className="h-3 w-3 ml-1" /> فیزیکی</>
              )}
            </Badge>
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full shadow-lg bg-white/90 hover:bg-white">
              <Heart className="h-4 w-4 text-foreground" />
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-bold text-base line-clamp-2 hover:text-primary transition-colors leading-relaxed">
            {product.name}
          </h3>
        </Link>
        {product.short_description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
            {product.short_description}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex flex-col">
          {hasDiscount ? (
            <>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)} تومان
              </span>
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.discount_price!)} تومان
              </span>
            </>
          ) : (
            <span className="text-lg font-bold">
              {formatPrice(product.price)} تومان
            </span>
          )}
        </div>
        <Button
          size="sm"
          className="rounded-xl shadow-sm"
          onClick={(e) => {
            e.preventDefault();
            addToCart(product.id);
          }}
          disabled={product.product_type === 'physical' && product.stock_quantity === 0}
        >
          <ShoppingCart className="h-4 w-4 ml-2" />
          خرید
        </Button>
      </CardFooter>
    </Card>
  );
}
