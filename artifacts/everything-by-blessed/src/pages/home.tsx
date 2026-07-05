import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useListProducts, useListTestimonials, useListGalleryItems, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Star } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getCategoryTheme } from "@/lib/category-colors";

const CATEGORY_IMAGES: Record<string, string> = {
  watches: "/products/steel-watch-set.jpg",
  necklaces: "/products/jesus-piece-pendant.jpg",
  bracelets: "/products/cuban-link-bracelet.jpg",
  earrings: "/products/bitcoin-earrings.jpg",
  rings: "/products/rose-gold-ring-set.jpg",
};

export default function Home() {
  const { data: products } = useListProducts({ featured: true });
  const { data: newArrivals } = useListProducts({ newArrival: true });
  const { data: testimonials } = useListTestimonials();
  const { data: gallery } = useListGalleryItems();
  const { data: categories } = useListCategories();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background z-10" />
        <div className="absolute inset-0 bg-[url('/products/gemstone-bracelet-duo.jpg')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(190,60,220,0.25),transparent_60%)] z-10" />

        <div className="container relative z-20 mx-auto px-4 text-center mt-20">
          <span className="inline-block py-1 px-3 border border-gold/40 rounded-full text-gold text-xs tracking-[0.2em] uppercase mb-6 backdrop-blur-sm bg-background/30">
            Lagos, Nigeria • Online Exclusive
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-gold via-primary to-sapphire font-bold mb-6 drop-shadow-2xl">
            Luxury That Speaks<br />Before You Do.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light tracking-wide">
            Everything by Blessed — ultra-premium jewelry, watches, and accessories. Curated for the modern Nigerian royalty.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto px-10 py-6 text-base tracking-widest uppercase bg-primary hover:bg-primary/80 shadow-[0_0_30px_rgba(200,50,120,0.4)] transition-all">
              <Link href="/shop">Enter Boutique</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-serif text-primary mb-8">Crafted for Excellence</h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-8">
            Based in Ojo, Abule, we serve clients who demand nothing but the absolute best. 
            Currently operating exclusively as an online boutique, delivering directly to you with 
            uncompromising discretion and speed.
          </p>
          <Link href="/shop" className="text-primary hover:text-white uppercase tracking-widest text-sm border-b border-primary pb-1 transition-colors">
            Discover the Collection
          </Link>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-primary">Shop by Category</h2>
            <p className="text-muted-foreground uppercase tracking-widest text-sm mt-2">Every piece has its own world</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {categories?.map((cat) => {
              const theme = getCategoryTheme(cat.slug);
              const image = CATEGORY_IMAGES[cat.slug];
              return (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border ${theme.border} bg-muted/20 block transition-all duration-500 hover:-translate-y-1 ${theme.glow}`}
                >
                  {image && (
                    <img
                      src={image}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <span className={`block w-8 h-0.5 mb-2 ${theme.bg}`} />
                    <h3 className="font-serif text-white text-lg leading-tight">{cat.name}</h3>
                  </div>
                </Link>
              );
            })}
            {categories?.length === 0 && (
              <div className="col-span-full py-10 text-center text-muted-foreground italic font-serif opacity-50">
                Categories being curated...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured / New Arrivals */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12 border-b border-primary/20 pb-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-primary">New Arrivals</h2>
              <p className="text-muted-foreground uppercase tracking-widest text-sm mt-2">The Latest Additions</p>
            </div>
            <Link href="/shop" className="text-primary hover:text-white uppercase tracking-widest text-xs hidden md:block">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals?.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
            {newArrivals?.length === 0 && (
              <div className="col-span-full py-10 text-center text-muted-foreground italic font-serif opacity-50">
                New arrivals being curated...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-primary">The Gallery</h2>
            <p className="text-muted-foreground uppercase tracking-widest text-sm mt-2">Worn by the best</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery?.slice(0, 8).map(item => {
              const cat = categories?.find((c) => c.id === item.categoryId);
              const theme = getCategoryTheme(cat?.slug);
              return (
                <div key={item.id} className={`aspect-square relative group overflow-hidden bg-muted/20 border ${theme.border} rounded-xl transition-all duration-500 hover:${theme.glow}`}>
                  {item.mediaType === "image" ? (
                    <img src={item.mediaUrl} alt="Gallery item" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <video src={item.mediaUrl} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                    <p className="text-white text-sm font-serif italic">{item.caption}</p>
                  </div>
                  {cat && (
                    <span className={`absolute top-2 left-2 px-2 py-0.5 ${theme.bg} text-white text-[10px] uppercase tracking-wider rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}>
                      {cat.name}
                    </span>
                  )}
                </div>
              );
            })}
            {gallery?.length === 0 && (
              <div className="col-span-full py-10 text-center text-muted-foreground italic font-serif opacity-50">
                Gallery moments coming soon...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,50,120,0.1),transparent_70%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-primary">Client Experiences</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials?.slice(0, 3).map(test => (
              <div key={test.id} className="p-8 bg-card/40 backdrop-blur-sm border border-primary/20 rounded-2xl">
                <div className="flex gap-1 mb-6 text-primary">
                  {Array.from({ length: test.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-lg text-foreground italic leading-relaxed mb-6">"{test.quote}"</p>
                <p className="font-serif text-primary uppercase tracking-widest text-sm">— {test.name}</p>
              </div>
            ))}
            {testimonials?.length === 0 && (
              <div className="col-span-full py-10 text-center text-muted-foreground italic font-serif opacity-50">
                Client testimonials arriving soon...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ & Contact */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-primary/20">
              <AccordionTrigger className="text-lg font-serif hover:text-primary">Where is your physical store located?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                We are based in Ojo, Abule, Lagos, Nigeria. However, we operate exclusively as an online boutique to provide a seamless, private luxury shopping experience. We deliver directly to you.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-primary/20">
              <AccordionTrigger className="text-lg font-serif hover:text-primary">How do I place an order?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Browse our collection and click "Order on WhatsApp" on any product. You will be redirected to a chat with our concierge team who will facilitate payment and secure delivery.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-primary/20">
              <AccordionTrigger className="text-lg font-serif hover:text-primary">Do you offer international shipping?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Yes, we offer worldwide shipping via premium logistics partners like DHL to ensure your luxury items arrive safely and on time.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

    </div>
  );
}
