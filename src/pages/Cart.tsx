import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  carbon_kg: number;
  water_liters: number;
  quantity: number;
}

const initialCart: CartItem[] = [
  { id: "1", name: "Organic Cotton T-Shirt", brand: "EcoWear", price: 899, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop", carbon_kg: 0.7, water_liters: 254, quantity: 1 },
  { id: "2", name: "Linen Summer Dress", brand: "EarthStyle", price: 1899, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop", carbon_kg: 1.62, water_liters: 738, quantity: 1 },
];

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>(initialCart);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))
    );
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Item removed");
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalCarbon = items.reduce((s, i) => s + i.carbon_kg * i.quantity, 0);
  const totalWater = items.reduce((s, i) => s + i.water_liters * i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="gradient-hero text-primary-foreground py-12 px-4 text-center">
        <h1 className="font-serif text-4xl mb-2">Your Cart</h1>
        <p className="opacity-90">{items.length} item{items.length !== 1 && "s"}</p>
      </section>

      <section className="container mx-auto px-4 py-10 max-w-4xl flex-1">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <motion.div key={item.id} layout className="bg-card rounded-xl p-4 shadow-[var(--shadow-card)] flex gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-sans font-bold text-sm text-foreground truncate">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.brand}</p>
                    <p className="text-primary font-bold mt-1">₹{item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted"><Minus className="h-3 w-3" /></button>
                      <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted"><Plus className="h-3 w-3" /></button>
                      <button onClick={() => remove(item.id)} className="ml-auto text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="bg-card rounded-xl p-5 shadow-[var(--shadow-card)]">
                <h3 className="font-sans font-bold text-primary mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-secondary">Free</span></div>
                  <div className="border-t border-border pt-2 flex justify-between font-bold text-primary"><span>Total</span><span>₹{subtotal.toLocaleString()}</span></div>
                </div>
                <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full" onClick={() => toast.success("Order placed! 🌱")}>
                  Checkout
                </Button>
              </div>

              <div className="gradient-stat text-primary-foreground rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3"><Leaf className="h-5 w-5" /><span className="font-bold text-sm">Eco Impact</span></div>
                <div className="space-y-1 text-sm">
                  <p>🌿 CO₂ saved: <strong>{(totalCarbon * 4).toFixed(1)} kg</strong></p>
                  <p>💧 Water saved: <strong>{(totalWater * 3).toLocaleString()} L</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Cart;
