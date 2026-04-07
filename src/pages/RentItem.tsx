import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "Custom"];
const occasions = [
  { emoji: "💒", name: "Wedding Guest" },
  { emoji: "👰", name: "Bride / Groom" },
  { emoji: "🎩", name: "Formal Event" },
  { emoji: "🎉", name: "Party" },
  { emoji: "📸", name: "Photoshoot" },
  { emoji: "💼", name: "Corporate" },
  { emoji: "🪔", name: "Festival" },
  { emoji: "✨", name: "Other" },
];

const RentItem = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", item: "", startDate: "", endDate: "", notes: "" });
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [agreed, setAgreed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    ctx.strokeStyle = "#2D5016";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    setDrawing(true);
    const ctx = canvasRef.current?.getContext("2d");
    const pos = getPos(e);
    ctx?.beginPath();
    ctx?.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    const pos = getPos(e);
    ctx?.lineTo(pos.x, pos.y);
    ctx?.stroke();
  };

  const clearSig = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const days = form.startDate && form.endDate
    ? Math.max(0, Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000))
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return toast.error("Please accept the rental agreement");
    toast.success("Rental request submitted! 🎉");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="gradient-amber text-amber-foreground py-14 px-4 text-center relative overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <h1 className="font-serif text-4xl mb-2">Rent Fashion for Any <em>Occasion</em></h1>
          <p className="opacity-85 max-w-lg mx-auto">Wear stunning designer pieces without the price tag. Return after the event — no waste, no guilt.</p>
          <div className="flex justify-center gap-3 mt-5 flex-wrap">
            {["Choose Item", "Pick Dates", "Sign Agreement", "Receive & Enjoy"].map((s, i) => (
              <span key={s} className="bg-amber-foreground/10 border border-amber-foreground/20 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-medium">
                {i + 1}. {s}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-10 max-w-3xl flex-1 -mt-4 relative z-10">
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-xl overflow-hidden">
          {/* Personal Details */}
          <div className="p-6 border-b border-border">
            <h3 className="font-sans font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center text-amber text-sm">👤</span>
              Your Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="rounded-xl" />
              <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="rounded-xl" />
              <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl" />
              <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-xl" />
            </div>
          </div>

          {/* Item */}
          <div className="p-6 border-b border-border">
            <h3 className="font-sans font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-sm">👗</span>
              Item to Rent
            </h3>
            <Textarea placeholder="Describe the item you'd like to rent..." value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} required className="rounded-xl" />
          </div>

          {/* Dates & Size */}
          <div className="p-6 border-b border-border">
            <h3 className="font-sans font-bold text-primary mb-4 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-amber" /> Rental Period
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required className="rounded-xl" />
              <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required className="rounded-xl" />
            </div>
            {days > 0 && (
              <div className="bg-amber/10 border border-amber rounded-xl px-3 py-2 text-sm font-semibold text-amber mb-4">
                📅 {days} day{days !== 1 && "s"} selected
              </div>
            )}

            <p className="font-sans font-semibold text-sm text-primary mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-1.5 rounded-full border text-sm font-semibold transition-all ${
                    selectedSize === s
                      ? "border-amber bg-amber text-amber-foreground"
                      : "border-border hover:border-amber hover:text-amber"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <p className="font-sans font-semibold text-sm text-primary mt-4 mb-2">Occasion</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {occasions.map((o) => (
                <button
                  key={o.name}
                  type="button"
                  onClick={() => setSelectedOccasion(o.name)}
                  className={`rounded-xl border p-3 text-center transition-all ${
                    selectedOccasion === o.name
                      ? "border-amber bg-amber/10"
                      : "border-border hover:border-amber hover:bg-amber/5"
                  }`}
                >
                  <span className="text-xl block">{o.emoji}</span>
                  <span className="text-[11px] font-bold">{o.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Agreement & Signature */}
          <div className="p-6 border-b border-border">
            <h3 className="font-sans font-bold text-primary mb-4 flex items-center gap-2">
              <Pen className="h-5 w-5 text-secondary" /> Rental Agreement
            </h3>
            <div className="bg-muted/50 border border-border rounded-xl p-4 max-h-40 overflow-y-auto text-xs text-muted-foreground leading-relaxed mb-4">
              <h4 className="font-bold text-primary text-sm mb-2">Terms and Conditions</h4>
              <p className="mb-2">By renting through EcoThrift, you agree to:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Return the item within the agreed rental period</li>
                <li>Keep the item in good condition</li>
                <li>Pay for any damages beyond normal wear</li>
                <li>Not alter or modify the rented items</li>
                <li>Return items in the original packaging</li>
              </ul>
            </div>

            <div className="border border-border rounded-xl overflow-hidden mb-4">
              <div className="bg-muted/50 px-3 py-2 border-b border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">✍️ Draw your signature</span>
                <button type="button" onClick={clearSig} className="text-xs px-2 py-1 rounded-md border border-border hover:bg-muted">Clear</button>
              </div>
              <canvas
                ref={canvasRef}
                className="w-full h-[120px] cursor-crosshair touch-none bg-card"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={() => setDrawing(false)}
                onMouseLeave={() => setDrawing(false)}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={() => setDrawing(false)}
              />
            </div>

            <label className="flex items-center gap-3 bg-amber/5 border border-amber/20 rounded-xl px-4 py-3 cursor-pointer">
              <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} />
              <span className="text-sm text-muted-foreground">
                I agree to the <strong className="text-primary">rental terms and conditions</strong>
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="p-6 bg-gradient-to-r from-amber/10 to-amber/20 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h4 className="font-sans font-bold text-amber text-sm">Ready to rent?</h4>
              <p className="text-xs text-muted-foreground">We'll confirm availability within 24h</p>
            </div>
            <Button type="submit" className="gradient-amber text-amber-foreground rounded-xl px-8 font-bold hover:shadow-lg transition-all">
              Submit Request 🎉
            </Button>
          </div>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default RentItem;
