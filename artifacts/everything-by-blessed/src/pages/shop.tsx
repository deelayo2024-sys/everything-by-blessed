import { useEffect, useState } from "react";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty";
import { Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategoryTheme } from "@/lib/category-colors";

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat) setActiveCategory(cat);
  }, []);

  const { data: categories } = useListCategories();
  const { data: products, isLoading, error } = useListProducts(
    activeCategory ? { categorySlug: activeCategory } : undefined
  );

  return (
    <div className="min-h-screen container mx-auto px-4 py-12 pt-24">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">The Collection</h1>
        <p className="text-muted-foreground uppercase tracking-widest text-sm">Explore our curated luxury pieces</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <Button 
          variant={activeCategory === null ? "default" : "outline"}
          onClick={() => setActiveCategory(null)}
          className={activeCategory === null ? "bg-primary text-primary-foreground" : "border-primary/20 text-foreground"}
        >
          All Pieces
        </Button>
        {categories?.map(cat => {
          const theme = getCategoryTheme(cat.slug);
          const isActive = activeCategory === cat.slug;
          return (
            <Button
              key={cat.id}
              variant={isActive ? "default" : "outline"}
              onClick={() => setActiveCategory(cat.slug)}
              className={isActive ? `${theme.bg} text-white border-none ${theme.glow}` : `border-primary/20 text-foreground hover:${theme.border} hover:${theme.text}`}
            >
              {cat.name}
            </Button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner className="w-8 h-8 text-primary" />
        </div>
      ) : error ? (
        <div className="text-destructive text-center py-20">Failed to load products.</div>
      ) : products?.length === 0 ? (
        <div className="py-20 max-w-md mx-auto">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Gem />
              </EmptyMedia>
              <EmptyTitle>Collection Expanding</EmptyTitle>
              <EmptyDescription>
                Our curators are currently preparing the digital showcase. Real products are being added soon.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
