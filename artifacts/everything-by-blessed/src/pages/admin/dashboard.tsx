import { useState } from "react";
import { useAdminLogout, useGetAdminSession } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetAdminSessionQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { LogOut, Package, Image as ImageIcon, MessageSquare, Tags } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProductsTab from "./products-tab";
import CategoriesTab from "./categories-tab";
import GalleryTab from "./gallery-tab";
import TestimonialsTab from "./testimonials-tab";

export default function Dashboard() {
  const { data: session } = useGetAdminSession();
  const logout = useAdminLogout();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await logout.mutateAsync();
    queryClient.setQueryData(getGetAdminSessionQueryKey(), { authenticated: false, email: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-primary/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-xl text-primary">Admin Control</h1>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs tracking-wider rounded-sm">
              {session?.email}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-primary">
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-8">
          <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            <TabsList className="bg-card/50 border border-primary/10">
              <TabsTrigger value="products" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Package className="w-4 h-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Tags className="w-4 h-4 mr-2" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="gallery" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <ImageIcon className="w-4 h-4 mr-2" />
                Gallery
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <MessageSquare className="w-4 h-4 mr-2" />
                Testimonials
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-card border border-primary/10 rounded-xl p-6 min-h-[60vh]">
            <TabsContent value="products" className="m-0 focus-visible:outline-none">
              <ProductsTab />
            </TabsContent>
            <TabsContent value="categories" className="m-0 focus-visible:outline-none">
              <CategoriesTab />
            </TabsContent>
            <TabsContent value="gallery" className="m-0 focus-visible:outline-none">
              <GalleryTab />
            </TabsContent>
            <TabsContent value="testimonials" className="m-0 focus-visible:outline-none">
              <TestimonialsTab />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
