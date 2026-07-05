import { useState } from "react";
import { 
  useListTestimonials, 
  useCreateTestimonial, 
  useDeleteTestimonial,
  getListTestimonialsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Trash2, Plus, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function TestimonialsTab() {
  const { data: testimonials, isLoading } = useListTestimonials();
  const createTestimonial = useCreateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState<number>(5);

  const resetForm = () => {
    setName("");
    setQuote("");
    setRating(5);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTestimonial.mutateAsync({ data: { name, quote, rating } });
      toast({ title: "Success", description: "Testimonial created" });
      queryClient.invalidateQueries({ queryKey: getListTestimonialsQueryKey() });
      setIsOpen(false);
      resetForm();
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to save testimonial", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete testimonial?")) return;
    try {
      await deleteTestimonial.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListTestimonialsQueryKey() });
      toast({ title: "Success", description: "Testimonial deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to delete testimonial", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="py-10 flex justify-center"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-primary">Manage Testimonials</h2>
        <Dialog open={isOpen} onOpenChange={(open) => {
          if (!open) resetForm();
          setIsOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-primary font-serif">New Testimonial</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Quote</Label>
                <Textarea value={quote} onChange={(e) => setQuote(e.target.value)} required rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Rating (1-5)</Label>
                <Input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(parseInt(e.target.value) || 5)} required />
              </div>
              <Button type="submit" className="w-full" disabled={createTestimonial.isPending}>
                {createTestimonial.isPending ? <Spinner className="w-4 h-4" /> : "Save Testimonial"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {testimonials?.map((test) => (
          <div key={test.id} className="p-6 bg-muted/20 border border-primary/10 rounded-lg relative">
            <div className="flex gap-1 mb-3 text-primary">
              {Array.from({ length: test.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="italic text-muted-foreground mb-4">"{test.quote}"</p>
            <p className="font-serif text-foreground">— {test.name}</p>
            <div className="absolute top-4 right-4">
              <Button size="icon" variant="outline" onClick={() => handleDelete(test.id)} className="border-destructive/20 text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {testimonials?.length === 0 && (
          <p className="text-muted-foreground text-center py-10 col-span-full">No testimonials found.</p>
        )}
      </div>
    </div>
  );
}
