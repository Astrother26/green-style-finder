import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, Droplets, Zap, Trophy, Award, ShoppingBag, CalendarDays, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getProfile } from "@/lib/api";

const levelTitles: Record<number, string> = {
  1: "🌱 Eco Starter", 2: "🌿 Eco Grower", 3: "🍃 Eco Enthusiast",
  4: "🌳 Eco Warrior", 5: "🏆 Eco Champion", 6: "👑 Eco Master",
  7: "💚 Green Legend", 8: "🌍 Planet Saver", 9: "⭐ Eco Icon", 10: "🔥 Earth Guardian",
};
const levelThresholds = [0, 5, 10, 20, 35, 50, 75, 100, 150, 200];

const allAchievements = [
  { emoji: "🌱", label: "First Purchase" },
  { emoji: "♻️", label: "Eco Warrior" },
  { emoji: "🌍", label: "Planet Saver" },
  { emoji: "👑", label: "Eco Master" },
  { emoji: "💚", label: "Carbon Hero" },
  { emoji: "💧", label: "Water Saver" },
  { emoji: "📦", label: "Reseller" },
  { emoji: "🔑", label: "Renter" },
];

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getProfile().then(setProfile).finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Sign in to view your profile</p>
            <Button onClick={() => navigate("/login")} className="bg-primary text-primary-foreground rounded-full">Sign In</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        <Footer />
      </div>
    );
  }

  const p = profile || { total_carbon_saved: 0, total_water_saved: 0, total_energy_saved: 0, total_items_purchased: 0, eco_level: 1, achievements: [], name: user.user_metadata?.name || "User" };
  const nextThreshold = levelThresholds[p.eco_level] || 200;
  const prevThreshold = levelThresholds[p.eco_level - 1] || 0;
  const progress = nextThreshold > prevThreshold ? ((p.total_items_purchased - prevThreshold) / (nextThreshold - prevThreshold)) * 100 : 100;
  const userAchievements = p.achievements || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="gradient-hero text-primary-foreground py-12 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-3 text-3xl">🌿</div>
          <h1 className="font-serif text-3xl mb-1">{p.name}</h1>
          <p className="opacity-80 text-sm">Level {p.eco_level} • {levelTitles[p.eco_level] || "🌱 Eco Starter"}</p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-10 max-w-4xl flex-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Leaf, value: `${(p.total_carbon_saved || 0).toFixed(1)} kg`, label: "CO₂ Saved", color: "text-secondary" },
            { icon: Droplets, value: `${(p.total_water_saved || 0).toLocaleString()} L`, label: "Water Saved", color: "text-blue-500" },
            { icon: Zap, value: `${(p.total_energy_saved || 0)} MJ`, label: "Energy Saved", color: "text-amber" },
            { icon: ShoppingBag, value: `${p.total_items_purchased || 0}`, label: "Items Thrifted", color: "text-primary" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-xl p-4 shadow-[var(--shadow-card)] text-center">
              <s.icon className={`h-6 w-6 mx-auto mb-2 ${s.color}`} />
              <p className="font-bold text-lg text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl p-5 shadow-[var(--shadow-card)] mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><Trophy className="h-5 w-5 text-amber" /><span className="font-sans font-bold text-primary">Level Progress</span></div>
            <span className="text-xs text-muted-foreground">{p.total_items_purchased}/{nextThreshold} items</span>
          </div>
          <Progress value={Math.min(100, progress)} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">Next: {levelTitles[p.eco_level + 1] || "Max Level!"}</p>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-[var(--shadow-card)] mb-8">
          <div className="flex items-center gap-2 mb-4"><Award className="h-5 w-5 text-amber" /><span className="font-sans font-bold text-primary">Achievements</span></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {allAchievements.map((a) => {
              const unlocked = userAchievements.some((ua: string) => ua.includes(a.label));
              return (
                <div key={a.label} className={`rounded-xl p-3 text-center border transition-all ${unlocked ? "border-secondary/30 bg-secondary/5" : "border-border bg-muted/30 opacity-50"}`}>
                  <span className="text-2xl block mb-1">{a.emoji}</span>
                  <span className="text-xs font-semibold text-foreground">{a.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 mb-4"><CalendarDays className="h-5 w-5 text-primary" /><span className="font-sans font-bold text-primary">Recent Activity</span></div>
          <p className="text-sm text-muted-foreground text-center py-6">Start shopping to build your eco history! 🌱</p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Profile;
