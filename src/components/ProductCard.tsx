import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const ProductCard = ({ product, onAddToCart }: { product: Product; onAddToCart?: () => void }) => (
  <div className="bg-card rounded-lg overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 group">
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
        <p>🌿 Saves <strong className="text-secondary">{(product.carbon_kg * 4).toFixed(1)} kg CO₂</strong> vs new</p>
      </div>

      <Button
        onClick={onAddToCart}
        className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-sm h-9"
      >
        <ShoppingCart className="h-3.5 w-3.5 mr-1.5" /> Add to Cart
      </Button>
    </div>
  </div>
);

export { type Product };
export default ProductCard;
