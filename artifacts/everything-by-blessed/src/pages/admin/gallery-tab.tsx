import { useState } from "react";
import { 
  useListGalleryItems, 
  useListCategories,
  useCreateGalleryItem, 
  useDeleteGalleryItem,
  useRequestUploadUrl,
  getListGalleryItemsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Trash2, Plus, Image as ImageIcon, Video } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { uploadFile } from "@/lib/upload";

export default function GalleryTab() {
  const { data: items, isLoading } = useListGalleryItems();
  const { data: categories } = useListCategories();
  const createItem = useCreateGalleryItem();
  const deleteItem = useDeleteGalleryItem();
  const requestUploadUrl = useRequestUploadUrl();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setCaption("");
    setCategoryId(null);
    setMediaUrl(null);
    setMediaType("image");
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    if (!e.target.files?.[0]) return;
    try {
      setUploading(true);
      const path = await uploadFile(e.target.files[0], requestUploadUrl.mutateAsync);
      setMediaUrl(path);
      setMediaType(type);
      toast({ title: "Upload complete" });
    } catch (err) {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl) {
      toast({ title: "Media required", description: "Please upload an image or video", variant: "destructive" });
      return;
    }
    try {
      await createItem.mutateAsync({ data: { mediaUrl, mediaType, caption, categoryId } });
      toast({ title: "Success", description: "Gallery item created" });
      queryClient.invalidateQueries({ queryKey: getListGalleryItemsQueryKey() });
      setIsOpen(false);
      resetForm();
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to save item", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete gallery item?")) return;
    try {
      await deleteItem.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListGalleryItemsQueryKey() });
      toast({ title: "Success", description: "Item deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to delete item", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="py-10 flex justify-center"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-primary">Manage Gallery</h2>
        <Dialog open={isOpen} onOpenChange={(open) => {
          if (!open) resetForm();
          setIsOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Add Media
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-primary font-serif">New Gallery Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <Label>Media Upload</Label>
                <div className="flex gap-4">
                  <Button type="button" variant="outline" className="relative cursor-pointer" disabled={uploading}>
                    <ImageIcon className="w-4 h-4 mr-2" /> Image
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleUpload(e, "image")} disabled={uploading}/>
                  </Button>
                  <Button type="button" variant="outline" className="relative cursor-pointer" disabled={uploading}>
                    <Video className="w-4 h-4 mr-2" /> Video
                    <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleUpload(e, "video")} disabled={uploading} />
                  </Button>
                  {uploading && <Spinner className="w-5 h-5 ml-2" />}
                </div>

                {mediaUrl && (
                  <div className="relative w-48 border border-primary/20 rounded-md overflow-hidden group">
                    {mediaType === 'image' ? (
                      <img src={mediaUrl} className="w-full" alt="preview" />
                    ) : (
                      <video src={mediaUrl} className="w-full" controls />
                    )}
                    <button type="button" onClick={() => setMediaUrl(null)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Caption (Optional)</Label>
                <Input value={caption} onChange={(e) => setCaption(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <Label>Category (Optional)</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={categoryId || ""}
                  onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : null)}
                >
                  <option value="">No Category</option>
                  {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <Button type="submit" className="w-full" disabled={createItem.isPending || uploading || !mediaUrl}>
                {createItem.isPending ? <Spinner className="w-4 h-4" /> : "Save Item"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items?.map((item) => (
          <div key={item.id} className="relative group aspect-square bg-muted/20 border border-primary/10 rounded-lg overflow-hidden">
            {item.mediaType === "image" ? (
              <img src={item.mediaUrl} alt={item.caption || ""} className="w-full h-full object-cover" />
            ) : (
              <video src={item.mediaUrl} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
              <p className="text-white text-xs line-clamp-2">{item.caption}</p>
              <div className="absolute top-2 right-2">
                <Button size="icon" variant="destructive" onClick={() => handleDelete(item.id)} className="h-8 w-8">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {items?.length === 0 && (
          <div className="col-span-full py-10 text-center text-muted-foreground">
            No gallery items found.
          </div>
        )}
      </div>
    </div>
  );
}
