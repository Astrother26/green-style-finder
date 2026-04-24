import { useState } from "react";
import { ShoppingCart, Leaf, Droplet, Award, Recycle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface Product {
  name: string;
  brand: string;
  price: number;
  image_url: string;
  category: string;
  gender: string;
  fabric: string;
  carbon_kg: number;
  water_liters?: number;
  sustainability_grade: string;
  sustainability_score?: number;
  match_score?: number;
}

const gradeColors: Record<string, string> = {
  "A+": "bg-secondary text-secondary-foreground",
  A: "bg-secondary/80 text-secondary-foreground",
  B: "bg-amber text-amber-foreground",
  C: "bg-amber/70 text-amber-foreground",
  D: "bg-accent/70 text-accent-foreground",
  F: "bg-destructive text-destructive-foreground",
};

const ProductCard = ({ product, onAddToCart }: { product: Product; onAddToCart?: () => void }) => {
  const [open, setOpen] = useState(false);
  const carbonSaved = product.carbon_kg * 4;
  const waterSaved = (product.water_liters || product.carbon_kg * 250) * 3;

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-card rounded-lg overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-bold ${gradeColors[product.sustainability_grade] || "bg-muted text-muted-foreground"}`}>
            {product.sustainability_grade}
          </span>
          <span className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium text-foreground capitalize">
            {product.gender}
          </span>
        </div>

        <div className="p-4">
          <h3 className="font-sans font-bold text-sm text-foreground truncate">{product.name}</h3>
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <p className="text-lg font-bold text-primary mt-1">₹{product.price.toLocaleString()}</p>

          <div className="flex gap-1.5 mt-2 flex-wrap">
            {product.match_score && (
              <span className="text-[10px] px-2 py-0.5 bg-secondary/10 text-secondary rounded-full font-semibold">
                {Math.round(product.match_score * 100)}% match
              </span>
            )}
            <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-semibold">
              {product.carbon_kg} kg CO₂
            </span>
          </div>

          <div className="bg-muted/50 rounded-md p-2 mt-3 text-[10px] text-muted-foreground">
            <p>🌿 Saves <strong className="text-secondary">{carbonSaved.toFixed(1)} kg CO₂</strong> vs new</p>
          </div>

          <Button
            onClick={(e) => { e.stopPropagation(); onAddToCart?.(); }}
            className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-sm h-9"
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5" /> Add to Cart
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl">
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-square md:aspect-auto overflow-hidden bg-muted">
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold ${gradeColors[product.sustainability_grade] || "bg-muted text-muted-foreground"}`}>
                Grade {product.sustainability_grade}
              </span>
            </div>
            <div className="p-6">
              <DialogHeader>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{product.brand} • {product.category}</p>
                <DialogTitle className="text-2xl font-serif text-primary">{product.name}</DialogTitle>
              </DialogHeader>

              <p className="text-2xl font-bold text-primary mt-3">₹{product.price.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1 capitalize">Fabric: {product.fabric.replace(/_/g, " ")}</p>

              <div className="mt-5 space-y-3">
                <h4 className="font-bold text-primary text-sm flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-secondary" /> Eco Carbon Impact
                </h4>

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-2">
                  <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-secondary mb-1">
                      <Recycle className="h-3 w-3" /> CO₂ Footprint
                    </div>
                    <p className="text-xl font-bold text-primary">{product.carbon_kg} <span className="text-xs font-normal">kg</span></p>
                  </div>
                  <div className="bg-amber/10 border border-amber/20 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-amber mb-1">
                      <Droplet className="h-3 w-3" /> Water Use
                    </div>
                    <p className="text-xl font-bold text-primary">{(product.water_liters || product.carbon_kg * 250).toFixed(0)} <span className="text-xs font-normal">L</span></p>
                  </div>
                  <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-3 col-span-2">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-secondary mb-1">
                      <Award className="h-3 w-3" /> You Save vs Buying New
                    </div>
                    <p className="text-sm font-bold text-primary">
                      🌿 {carbonSaved.toFixed(1)} kg CO₂ • 💧 {waterSaved.toFixed(0)} L water
                    </p>
                  </div>
                </motion.div>

                {product.sustainability_score !== undefined && (
                  <div className="bg-muted rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-muted-foreground">Sustainability Score</span>
                      <span className="font-bold text-primary text-sm">{Math.round(product.sustainability_score)}/100</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-secondary to-amber transition-all"
                        style={{ width: `${product.sustainability_score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={() => { onAddToCart?.(); setOpen(false); }}
                className="w-full mt-5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
              >
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { type Product };
export default ProductCard;
