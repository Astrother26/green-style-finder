import { useState, useCallback } from "react";
import { Upload, Search, Leaf, Recycle, BarChart3, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard, { type Product } from "@/components/ProductCard";
import { uploadAndRecommend, addToCart } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const sampleProducts: Product[] = [
  { name: "Organic Cotton T-Shirt", brand: "EcoWear", price: 899, image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop", category: "Tops", gender: "unisex", fabric: "organic_cotton", carbon_kg: 0.7, sustainability_grade: "A+", sustainability_score: 95, match_score: 0.95 },
  { name: "Recycled Denim Jeans", brand: "GreenLoop", price: 2499, image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop", category: "Jeans", gender: "women", fabric: "recycled_cotton", carbon_kg: 1.19, sustainability_grade: "A+", sustainability_score: 92, match_score: 0.92 },
  { name: "Linen Summer Dress", brand: "EarthStyle", price: 1899, image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop", category: "Dresses", gender: "women", fabric: "linen", carbon_kg: 1.62, sustainability_grade: "A", sustainability_score: 88, match_score: 0.88 },
  { name: "Hemp Hoodie", brand: "NatureWear", price: 3299, image_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop", category: "Jackets", gender: "unisex", fabric: "hemp", carbon_kg: 1.6, sustainability_grade: "A+", sustainability_score: 90, match_score: 0.85 },
  { name: "Wool Blend Sweater", brand: "CozyEarth", price: 2199, image_url: "https://images.unsplash.com/photo-1434389677669-e08b4cda3a70?w=400&h=500&fit=crop", category: "Sweaters", gender: "men", fabric: "wool", carbon_kg: 5.85, sustainability_grade: "D", sustainability_score: 42, match_score: 0.82 },
  { name: "Recycled Polyester Jacket", brand: "EcoLoop", price: 3999, image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop", category: "Jackets", gender: "women", fabric: "recycled_polyester", carbon_kg: 1.08, sustainability_grade: "A+", sustainability_score: 94, match_score: 0.9 },
  { name: "Cotton Blend Shirt", brand: "BasicGreen", price: 1299, image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop", category: "Shirts", gender: "men", fabric: "cotton", carbon_kg: 1.73, sustainability_grade: "B", sustainability_score: 68, match_score: 0.87 },
  { name: "Tencel Blouse", brand: "SilkEarth", price: 1599, image_url: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=500&fit=crop", category: "Tops", gender: "women", fabric: "lyocell", carbon_kg: 1.43, sustainability_grade: "A", sustainability_score: 85, match_score: 0.89 },
];

const features = [
  { icon: Upload, title: "Upload & Discover", desc: "Drop any clothing photo and our AI finds sustainable alternatives." },
  { icon: Recycle, title: "Carbon Tracker", desc: "See the environmental impact of every purchase you make." },
  { icon: BarChart3, title: "Eco Dashboard", desc: "Track your total savings in CO₂, water, and energy." },
];

const Index = () => {
  const [dragActive, setDragActive] = useState(false);
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { user } = useAuth();

  const processImage = async (file: File) => {
    setLoading(true);
    setAnalysis(null);
    try {
      const result = await uploadAndRecommend(file);
      if (result.recommendations.length > 0) {
        setProducts(result.recommendations);
        setAnalysis(result.analysis);
        toast.success(`Found ${result.recommendations.length} sustainable alternatives!`);
      } else {
        toast.info("No products found, showing default collection");
        setProducts(sampleProducts);
      }
    } catch (err: any) {
      console.error("Recommend error:", err);
      toast.error(err.message || "Failed to analyze image. Showing default products.");
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processImage(file);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      return;
    }
    try {
      await addToCart({
        product_sku: (product as any).sku || product.name.replace(/\s/g, "-").toLowerCase(),
        product_name: product.name,
        product_price: product.price,
        product_image: product.image_url,
        carbon_kg: product.carbon_kg,
        water_liters: product.water_liters || 0,
      });
      toast.success(`${product.name} added to cart! 🛒`);
    } catch (err: any) {
      toast.error(err.message || "Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="gradient-hero text-primary-foreground py-16 md:py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-primary-foreground/30 rounded-full" />
          <div className="absolute bottom-10 right-20 w-48 h-48 border border-primary-foreground/20 rounded-full" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-serif mb-4">
            Thrift Smarter with <em className="text-secondary">AI</em>
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-xl mx-auto">
            Upload any clothing photo. Get sustainable alternatives with full carbon footprint analysis.
          </p>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`mx-auto max-w-lg border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer ${
              dragActive ? "border-secondary bg-secondary/10 scale-105" : "border-primary-foreground/40 hover:border-secondary"
            }`}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            {loading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin mb-3" />
                <p className="font-semibold">Analyzing your image...</p>
                <p className="text-sm opacity-70">Finding sustainable alternatives</p>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 mx-auto mb-3 opacity-70" />
                <p className="font-semibold mb-1">Drop a clothing image here</p>
                <p className="text-sm opacity-70">or click to browse • JPG, PNG up to 16MB</p>
              </>
            )}
            <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleFileInput} disabled={loading} />
          </div>

          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-2 mt-4 flex-wrap"
            >
              {Object.entries(analysis).map(([key, val]) => (
                <span key={key} className="bg-primary-foreground/10 px-3 py-1 rounded-full text-xs font-medium capitalize">
                  {key}: {val as string}
                </span>
              ))}
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all hover:-translate-y-1 text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="font-sans font-bold text-lg text-primary mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="font-serif text-3xl text-primary text-center mb-8">
          {analysis ? "AI Recommendations" : "Sustainable Picks"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p, i) => (
            <ProductCard key={`${p.name}-${i}`} product={p} onAddToCart={() => handleAddToCart(p)} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
