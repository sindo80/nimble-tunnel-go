import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { ProductType } from '@/types/database';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useCategories();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [productType, setProductType] = useState<ProductType | undefined>(
    searchParams.get('type') as ProductType || undefined
  );
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('newest');

  const { products, loading } = useProducts({
    search: search || undefined,
    productType,
    categorySlug: selectedCategory || undefined,
  });

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.discount_price || a.price) - (b.discount_price || b.price);
      case 'price-high':
        return (b.discount_price || b.price) - (a.discount_price || a.price);
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (productType) params.set('type', productType);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
  }, [search, productType, selectedCategory]);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Product Type Filter */}
      <div>
        <h3 className="font-semibold mb-3">نوع محصول</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="all-types"
              checked={!productType}
              onCheckedChange={() => setProductType(undefined)}
            />
            <Label htmlFor="all-types">همه</Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="digital"
              checked={productType === 'digital'}
              onCheckedChange={() => setProductType(productType === 'digital' ? undefined : 'digital')}
            />
            <Label htmlFor="digital">محصولات دیجیتال</Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="physical"
              checked={productType === 'physical'}
              onCheckedChange={() => setProductType(productType === 'physical' ? undefined : 'physical')}
            />
            <Label htmlFor="physical">محصولات فیزیکی</Label>
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">دسته‌بندی</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="all-cats"
                checked={!selectedCategory}
                onCheckedChange={() => setSelectedCategory('')}
              />
              <Label htmlFor="all-cats">همه دسته‌ها</Label>
            </div>
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={cat.id}
                  checked={selectedCategory === cat.slug}
                  onCheckedChange={() => setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)}
                />
                <Label htmlFor={cat.id}>{cat.name}</Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setProductType(undefined);
          setSelectedCategory('');
          setSearch('');
        }}
      >
        پاک کردن فیلترها
      </Button>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">محصولات</h1>
          <p className="text-muted-foreground">
            {productType === 'digital' && 'محصولات دیجیتال'}
            {productType === 'physical' && 'محصولات فیزیکی'}
            {!productType && 'همه محصولات'}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                فیلترها
              </h2>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
              <div className="flex gap-2 items-center">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 ml-2" />
                      فیلترها
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <SheetHeader>
                      <SheetTitle>فیلترها</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <Input
                  type="search"
                  placeholder="جستجو..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-48 md:w-64"
                />
              </div>

              <div className="flex gap-2 items-center">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="مرتب‌سازی" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">جدیدترین</SelectItem>
                    <SelectItem value="price-low">ارزان‌ترین</SelectItem>
                    <SelectItem value="price-high">گران‌ترین</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-4">
              {products.length} محصول یافت شد
            </p>

            {/* Products Grid */}
            <ProductGrid products={sortedProducts} loading={loading} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
