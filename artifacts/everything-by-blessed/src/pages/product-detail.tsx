import { useParams } from "wouter";
import { useGetProduct, getGetProductQueryKey } from "@workspace/api-client-react";
import { Spinner } from "@/components/ui/spinner";
import { formatNaira } from "@/lib/format";
import { getWhatsAppLink, getProductWhatsAppMessage } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ProductDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);

  const { data: product, isLoading, error } = useGetProduct(id, {
    query: {
      enabled: !!id,
      queryKey: getGetProductQueryKey(id),
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Spinner className="w-12 h-12 text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 text-center space-y-4">
        <p className="text-destructive text-xl font-serif">Product not found.</p>
        <Button asChild variant="outline">
          <Link href="/shop"><ArrowLeft className="mr-2 w-4 h-4" /> Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const mainImage = product.images?.[0] || null;
  const galleryImages = product.images?.slice(1) || [];

  return (
    <div className="min-h-screen pt-24 pb-20 container mx-auto px-4">
      <Link href="/shop" className="inline-flex items-center text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft className="mr-2 w-4 h-4" /> Back to Collection
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Images Column */}
        <div className="space-y-6">
          <div className="aspect-[4/5] bg-muted/20 border border-primary/10 rounded-2xl overflow-hidden relative">
            {mainImage ? (
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-serif italic">No image available</div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              {product.newArrival && (
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs tracking-wider uppercase backdrop-blur-md rounded-full shadow-lg">New Arrival</span>
              )}
              {product.featured && (
                <span className="px-3 py-1 bg-accent text-accent-foreground text-xs tracking-wider uppercase backdrop-blur-md rounded-full shadow-lg">Featured</span>
              )}
            </div>
          </div>
          
          {galleryImages.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="aspect-square bg-muted/20 border border-primary/10 rounded-lg overflow-hidden">
                  <img src={img} alt={`${product.name} view ${idx + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {product.videoUrl && (
            <div className="aspect-video bg-muted/20 border border-primary/10 rounded-2xl overflow-hidden mt-6">
              <video src={product.videoUrl} controls className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="flex flex-col justify-start">
          <div className="sticky top-32">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">{product.name}</h1>
            <p className="text-2xl font-light text-foreground mb-8">
              {formatNaira(product.price)}
            </p>

            <div className="prose prose-invert prose-p:text-muted-foreground max-w-none mb-10">
              <p className="leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>

            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
                <span className="text-sm uppercase tracking-widest text-muted-foreground">
                  {product.inStock ? 'In Stock & Ready' : 'Out of Stock / Made to Order'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_0_20px_rgba(37,211,102,0.3)] border-none">
                <a
                  href={getWhatsAppLink(getProductWhatsAppMessage(product.name))}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Order on WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="flex-1 border-primary/30 hover:bg-primary/10 text-primary">
                <a
                  href={getWhatsAppLink(`Hello Everything by Blessed, I have an inquiry about ${product.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enquire
                </a>
              </Button>
            </div>

            <div className="mt-12 pt-8 border-t border-primary/10 space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground uppercase tracking-widest">Delivery</span>
                <span className="text-sm">Worldwide via DHL / Local Lagos Dispatch</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground uppercase tracking-widest">Returns</span>
                <span className="text-sm">Exchange within 7 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
