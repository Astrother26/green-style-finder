import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, Calendar, Loader2, Star, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  size: string;
  price_per_day: number;
  image_url: string | null;
  availability: boolean;
  description: string | null;
}

const categories = ["All", "Ethnic", "Casual", "Formal", "Wedding", "Party"];
const sizes = ["All", "S", "M", "L", "XL", "Free Size"];

const ClothingRental = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSize, setActiveSize] = useState("All");
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clothing_items")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load clothing items");
      console.error(error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.description || "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || item.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSize = activeSize === "All" || item.size === activeSize;
      return matchesSearch && matchesCategory && matchesSize;
    });
  }, [items, search, activeCategory, activeSize]);

  const rentalDays = startDate && endDate
    ? Math.max(0, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000))
    : 0;

  const totalPrice = selectedItem ? rentalDays * selectedItem.price_per_day : 0;

  const handleRentNow = async () => {
    if (!user) {
      toast.error("Please sign in to rent items");
      navigate("/login");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select rental dates");
      return;
    }
    if (rentalDays <= 0) {
      toast.error("End date must be after start date");
      return;
    }
    if (!selectedItem) return;

    setBooking(true);
    try {
      const { error } = await supabase.from("rentals").insert({
        user_id: user.id,
        item_name: selectedItem.name,
        clothing_item_id: selectedItem.id,
        size: selectedItem.size,
        start_date: startDate,
        end_date: endDate,
        total_price: totalPrice,
        occasion: selectedItem.category,
      });
      if (error) throw error;

      toast.success(`Booked "${selectedItem.name}" for ${rentalDays} days! 🎉`);
      setSelectedItem(null);
      setStartDate("");
      setEndDate("");
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || "Failed to book rental");
    } finally {
      setBooking(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="gradient-amber text-amber-foreground py-14 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-6 right-10 w-40 h-40 border border-amber-foreground/20 rounded-full" />
          <div className="absolute bottom-4 left-16 w-24 h-24 border border-amber-foreground/30 rounded-full" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif mb-3">
            Rent Designer <em>Fashion</em>
          </h1>
          <p className="text-lg opacity-90 mb-6 max-w-lg mx-auto">
            Wear stunning outfits for any occasion without buying. Browse, book, and slay.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 opacity-60" />
            <Input
              placeholder="Search for sarees, suits, dresses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 py-6 rounded-2xl bg-white/90 text-foreground border-0 shadow-lg text-base"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Filter className="h-5 w-5 text-muted-foreground mt-1.5" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSize(s)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  activeSize === s
                    ? "border-amber bg-amber text-amber-foreground"
                    : "border-border hover:border-amber"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Items Grid */}
      <section className="container mx-auto px-4 pb-16 flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading collection...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl mb-2">🧥</p>
            <p className="text-muted-foreground font-medium">No items found matching your filters.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setActiveCategory("All"); setActiveSize("All"); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">{filtered.length} item{filtered.length !== 1 && "s"} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <AnimatePresence>
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all hover:-translate-y-1 cursor-pointer group"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <Badge
                        className={`absolute top-3 left-3 ${
                          item.availability
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-destructive text-destructive-foreground"
                        }`}
                      >
                        {item.availability ? "Available" : "Rented"}
                      </Badge>
                      <Badge className="absolute top-3 right-3 bg-card/80 text-foreground backdrop-blur-sm">
                        {item.size}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground capitalize font-medium mb-1">{item.category}</p>
                      <h3 className="font-bold text-primary text-base mb-2 line-clamp-1">{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 font-bold text-amber text-lg">
                          <IndianRupee className="h-4 w-4" />
                          {item.price_per_day}
                          <span className="text-xs text-muted-foreground font-normal">/day</span>
                        </span>
                        <Button
                          size="sm"
                          variant={item.availability ? "default" : "outline"}
                          disabled={!item.availability}
                          className="rounded-full text-xs"
                          onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                        >
                          {item.availability ? "Rent Now" : "Unavailable"}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </section>

      {/* Detail / Booking Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => { if (!open) setSelectedItem(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl">
          {selectedItem && (
            <>
              <div className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden rounded-t-2xl">
                <img
                  src={selectedItem.image_url || "/placeholder.svg"}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
                <Badge
                  className={`absolute top-4 left-4 text-sm px-3 py-1 ${
                    selectedItem.availability
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-destructive text-destructive-foreground"
                  }`}
                >
                  {selectedItem.availability ? "✓ Available" : "✗ Currently Rented"}
                </Badge>
              </div>

              <div className="p-6">
                <DialogHeader className="mb-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{selectedItem.category}</p>
                  <DialogTitle className="text-2xl font-serif text-primary">{selectedItem.name}</DialogTitle>
                </DialogHeader>

                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{selectedItem.description}</p>

                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="bg-muted rounded-xl px-4 py-2 text-center">
                    <p className="text-xs text-muted-foreground">Size</p>
                    <p className="font-bold text-primary">{selectedItem.size}</p>
                  </div>
                  <div className="bg-muted rounded-xl px-4 py-2 text-center">
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="font-bold text-amber flex items-center gap-0.5">
                      <IndianRupee className="h-3.5 w-3.5" />{selectedItem.price_per_day}/day
                    </p>
                  </div>
                  <div className="bg-muted rounded-xl px-4 py-2 text-center">
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="font-bold text-primary capitalize">{selectedItem.category}</p>
                  </div>
                </div>

                {selectedItem.availability ? (
                  <div className="border border-border rounded-2xl p-5 bg-muted/30">
                    <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-amber" /> Select Rental Dates
                    </h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs text-muted-foreground font-medium mb-1 block">Start Date</label>
                        <Input
                          type="date"
                          min={today}
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground font-medium mb-1 block">End Date</label>
                        <Input
                          type="date"
                          min={startDate || today}
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    {rentalDays > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-amber/10 border border-amber/30 rounded-xl p-4 mb-4"
                      >
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{rentalDays} day{rentalDays !== 1 && "s"} × ₹{selectedItem.price_per_day}</span>
                          <span className="font-bold text-xl text-amber flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />{totalPrice.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </motion.div>
                    )}

                    <Button
                      className="w-full gradient-amber text-amber-foreground rounded-xl font-bold text-base py-6 hover:shadow-lg transition-all"
                      disabled={booking || rentalDays <= 0}
                      onClick={handleRentNow}
                    >
                      {booking ? (
                        <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Booking...</>
                      ) : rentalDays > 0 ? (
                        `Rent Now — ₹${totalPrice.toLocaleString("en-IN")}`
                      ) : (
                        "Select dates to continue"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-5 text-center">
                    <p className="text-destructive font-semibold">This item is currently rented out.</p>
                    <p className="text-sm text-muted-foreground mt-1">Check back later for availability.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ClothingRental;
