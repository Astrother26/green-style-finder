import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Camera, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const conditions = ["Like New", "Good", "Fair", "Vintage"];
const categories = ["Tops", "Dresses", "Jeans", "Shirts", "Jackets", "Sweaters", "Shorts", "Skirts"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const ListItem = () => {
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({ title: "", category: "", condition: "", size: "", price: "", originalPrice: "", description: "" });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result && images.length < 4) {
          setImages((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Item listed successfully! 🎉");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="gradient-hero text-primary-foreground py-12 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-4xl mb-2">Sell Your Pre-Loved Items</h1>
          <p className="opacity-90">Give your clothes a second life 🌿</p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-10 max-w-2xl flex-1">
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-5">
          {/* Images */}
          <div>
            <label className="block font-sans font-semibold text-sm text-primary mb-2">Photos (up to 4)</label>
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              {images.length < 4 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-secondary transition-colors">
                  <Camera className="h-6 w-6 text-muted-foreground mb-1" />
                  <span className="text-[10px] text-muted-foreground">Add</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>

          <Input placeholder="Item title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="rounded-xl" />

          <div className="grid grid-cols-2 gap-4">
            <Select onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select onValueChange={(v) => setForm({ ...form, condition: v })}>
              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Condition" /></SelectTrigger>
              <SelectContent>{conditions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Select onValueChange={(v) => setForm({ ...form, size: v })}>
              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Size" /></SelectTrigger>
              <SelectContent>{sizes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <Input placeholder="Price ₹" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-xl" />
            <Input placeholder="Original ₹" type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className="rounded-xl" />
          </div>

          <Textarea placeholder="Description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl min-h-[100px]" />

          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
            <Tag className="h-4 w-4 mr-2" /> List Item
          </Button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default ListItem;
