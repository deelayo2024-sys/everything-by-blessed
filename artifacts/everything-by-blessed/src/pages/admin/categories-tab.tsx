import { useState } from "react";
import { 
  useListCategories, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory,
  getListCategoriesQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Trash2, Edit2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function CategoriesTab() {
  const { data: categories, isLoading } = useListCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const resetForm = () => {
    setName("");
    setSlug("");
    setEditingId(null);
  };

  const handleOpen = (cat?: NonNullable<typeof categories>[number]) => {
    if (cat) {
      setEditingId(cat.id);
      setName(cat.name);
      setSlug(cat.slug);
    } else {
      resetForm();
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCategory.mutateAsync({ id: editingId, data: { name, slug } });
        toast({ title: "Success", description: "Category updated" });
      } else {
        await createCategory.mutateAsync({ data: { name, slug } });
        toast({ title: "Success", description: "Category created" });
      }
      queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
      setIsOpen(false);
      resetForm();
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to save category", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete category?")) return;
    try {
      await deleteCategory.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
      toast({ title: "Success", description: "Category deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to delete category", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="py-10 flex justify-center"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-primary">Manage Categories</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen()} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-primary font-serif">{editingId ? "Edit Category" : "New Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => {
                  setName(e.target.value);
                  if (!editingId) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }} required />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={createCategory.isPending || updateCategory.isPending}>
                {(createCategory.isPending || updateCategory.isPending) ? <Spinner className="w-4 h-4" /> : "Save Category"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {categories?.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between p-4 bg-muted/20 border border-primary/10 rounded-lg">
            <div>
              <p className="font-medium text-foreground">{cat.name}</p>
              <p className="text-sm text-muted-foreground uppercase tracking-widest">{cat.slug}</p>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" onClick={() => handleOpen(cat)} className="border-primary/20 hover:text-primary">
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={() => handleDelete(cat.id)} className="border-destructive/20 text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {categories?.length === 0 && (
          <p className="text-muted-foreground text-center py-10">No categories found.</p>
        )}
      </div>
    </div>
  );
}
