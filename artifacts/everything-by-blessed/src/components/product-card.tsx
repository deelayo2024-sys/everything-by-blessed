import { Link } from "wouter";
import { formatNaira } from "@/lib/format";
import { getWhatsAppLink, getProductWhatsAppMessage } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import type { Product } from "@workspace/api-client-react";
import { useListCategories } from "@workspace/api-client-react";
import { getCategoryTheme } from "@/lib/category-colors";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.[0] || null;
  const { data: categories } = useListCategories();
  const category = categories?.find((c) => c.id === product.categoryId);
  const theme = getCategoryTheme(category?.slug);

  return (
    <div className={`group relative flex flex-col bg-card/50 backdrop-blur-sm border border-primary/10 rounded-xl overflow-hidden hover:${theme.border} transition-all duration-500`}>
      <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-muted">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground font-serif italic opacity-50">
            Image coming soon
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {category && (
            <span className={`px-3 py-1 ${theme.bg} text-white text-xs tracking-wider uppercase backdrop-blur-md rounded-full shadow-lg ${theme.glow}`}>
              {category.name}
            </span>
          )}
          {product.newArrival && (
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs tracking-wider uppercase backdrop-blur-md rounded-full shadow-lg">
              New Arrival
            </span>
          )}
          {product.featured && (
            <span className="px-3 py-1 bg-accent text-accent-foreground text-xs tracking-wider uppercase backdrop-blur-md rounded-full shadow-lg">
              Featured
            </span>
          )}
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4 mb-2">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <span className={`font-medium whitespace-nowrap ${theme.text}`}>
            {formatNaira(product.price)}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
          {product.description}
        </p>

        <div className="flex gap-3 mt-auto">
          <Button asChild variant="outline" className="flex-1 bg-transparent border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors">
            <Link href={`/product/${product.id}`}>View Details</Link>
          </Button>
          <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(200,50,120,0.3)]">
            <a
              href={getWhatsAppLink(getProductWhatsAppMessage(product.name))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Order
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
