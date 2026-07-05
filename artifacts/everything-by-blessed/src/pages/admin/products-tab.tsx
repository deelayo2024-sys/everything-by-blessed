import { useState } from "react";
import { 
  useListProducts, 
  useListCategories,
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct,
  useRequestUploadUrl,
  getListProductsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Trash2, Edit2, Plus, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { uploadFile } from "@/lib/upload";
import { formatNaira } from "@/lib/format";

export default function ProductsTab() {
  const { data: products, isLoading } = useListProducts();
  const { data: categories } = useListCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const requestUploadUrl = useRequestUploadUrl();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [inStock, setInStock] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice(null);
    setCategoryId(null);
    setInStock(true);
    setFeatured(false);
    setNewArrival(false);
    setImages([]);
    setVideoUrl(null);
    setEditingId(null);
  };

  const handleOpen = (prod?: NonNullable<typeof products>[number]) => {
    if (prod) {
      setEditingId(prod.id);
      setName(prod.name);
      setDescription(prod.description);
      setPrice(prod.price);
      setCategoryId(prod.categoryId);
      setInStock(prod.inStock);
      setFeatured(prod.featured);
      setNewArrival(prod.newArrival);
      setImages(prod.images || []);
      setVideoUrl(prod.videoUrl);
    } else {
      resetForm();
    }
    setIsOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    try {
      setUploading(true);
      const newImages = [...images];
      for (let i = 0; i < e.target.files.length; i++) {
        const path = await uploadFile(e.target.files[i], requestUploadUrl.mutateAsync);
        newImages.push(path);
      }
      setImages(newImages);
      toast({ title: "Upload complete" });
    } catch (err) {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    try {
      setUploading(true);
      const path = await uploadFile(e.target.files[0], requestUploadUrl.mutateAsync);
      setVideoUrl(path);
      toast({ title: "Video upload complete" });
    } catch (err) {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name, description, price, categoryId, inStock, featured, newArrival, images, videoUrl
    };
    try {
      if (editingId) {
        await updateProduct.mutateAsync({ id: editingId, data });
        toast({ title: "Success", description: "Product updated" });
      } else {
        await createProduct.mutateAsync({ data });
        toast({ title: "Success", description: "Product created" });
      }
      queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
      setIsOpen(false);
      resetForm();
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to save product", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete product?")) return;
    try {
      await deleteProduct.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
      toast({ title: "Success", description: "Product deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to delete product", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="py-10 flex justify-center"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-primary">Manage Products</h2>
        <Dialog open={isOpen} onOpenChange={(open) => {
          if(!open) resetForm();
          setIsOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen()} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-primary/20 max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-primary font-serif">{editingId ? "Edit Product" : "New Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Price (NGN) - Leave empty for "₦40,000+"</Label>
                  <Input 
                    type="number" 
                    value={price === null ? "" : price} 
                    onChange={(e) => setPrice(e.target.value ? parseInt(e.target.value) : null)} 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={categoryId || ""}
                    onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : null)}
                  >
                    <option value="">No Category</option>
                    {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 p-4 border border-primary/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Switch checked={inStock} onCheckedChange={setInStock} />
                  <Label>In Stock</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={featured} onCheckedChange={setFeatured} />
                  <Label>Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={newArrival} onCheckedChange={setNewArrival} />
                  <Label>New Arrival</Label>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Media Uploads</Label>
                <div className="flex gap-4">
                  <Button type="button" variant="outline" className="relative cursor-pointer" disabled={uploading}>
                    <ImageIcon className="w-4 h-4 mr-2" /> Upload Images
                    <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} disabled={uploading}/>
                  </Button>
                  <Button type="button" variant="outline" className="relative cursor-pointer" disabled={uploading}>
                    <ImageIcon className="w-4 h-4 mr-2" /> Upload Video
                    <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleVideoUpload} disabled={uploading} />
                  </Button>
                  {uploading && <Spinner className="w-5 h-5 ml-2" />}
                </div>

                {images.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {images.map((img, i) => (
                      <div key={i} className="relative w-24 h-24 group rounded-md overflow-hidden border border-primary/20">
                        <img src={img} className="w-full h-full object-cover" alt="upload" />
                        <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {videoUrl && (
                  <div className="relative w-48 border border-primary/20 rounded-md overflow-hidden group">
                    <video src={videoUrl} className="w-full" />
                    <button type="button" onClick={() => setVideoUrl(null)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={createProduct.isPending || updateProduct.isPending || uploading}>
                {(createProduct.isPending || updateProduct.isPending) ? <Spinner className="w-4 h-4" /> : "Save Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products?.map((prod) => (
          <div key={prod.id} className="flex flex-col bg-muted/20 border border-primary/10 rounded-lg overflow-hidden group">
            <div className="aspect-[4/5] bg-muted relative">
              {prod.images?.[0] ? (
                <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
              )}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" onClick={() => handleOpen(prod)} className="h-8 w-8">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(prod.id)} className="h-8 w-8">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <p className="font-medium text-foreground line-clamp-1">{prod.name}</p>
              <p className="text-sm text-primary mb-2">{formatNaira(prod.price)}</p>
              <div className="flex flex-wrap gap-1 mt-auto">
                {!prod.inStock && <span className="text-[10px] bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">Out of Stock</span>}
                {prod.featured && <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full">Featured</span>}
              </div>
            </div>
          </div>
        ))}
        {products?.length === 0 && (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            No products found. Start building your collection.
          </div>
        )}
      </div>
    </div>
  );
}
