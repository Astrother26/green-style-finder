import { motion } from "framer-motion";
import { Leaf, Droplets, Zap, Trophy, Award, ShoppingBag, CalendarDays } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Progress } from "@/components/ui/progress";

const levels = [
  { level: 1, title: "🌱 Eco Starter", items: 0 },
  { level: 2, title: "🌿 Eco Grower", items: 5 },
  { level: 3, title: "🍃 Eco Enthusiast", items: 10 },
  { level: 4, title: "🌳 Eco Warrior", items: 20 },
  { level: 5, title: "🏆 Eco Champion", items: 35 },
];

const achievements = [
  { emoji: "🌱", label: "First Purchase", unlocked: true },
  { emoji: "♻️", label: "Eco Warrior", unlocked: true },
  { emoji: "🌍", label: "Planet Saver", unlocked: false },
  { emoji: "👑", label: "Eco Master", unlocked: false },
  { emoji: "💚", label: "Carbon Hero", unlocked: true },
  { emoji: "💧", label: "Water Saver", unlocked: false },
  { emoji: "📦", label: "Reseller", unlocked: false },
  { emoji: "🔑", label: "Renter", unlocked: false },
];

const Profile = () => {
  const user = { name: "Guest User", items: 7, carbon: 12.4, water: 4200, energy: 380, level: 2 };
  const nextLevel = levels.find((l) => l.items > user.items) || levels[levels.length - 1];
  const progress = (user.items / nextLevel.items) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="gradient-hero text-primary-foreground py-12 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-3 text-3xl">
            🌿
          </div>
          <h1 className="font-serif text-3xl mb-1">{user.name}</h1>
          <p className="opacity-80 text-sm">Level {user.level} • {levels[user.level - 1]?.title}</p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-10 max-w-4xl flex-1">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Leaf, value: `${user.carbon} kg`, label: "CO₂ Saved", color: "text-secondary" },
            { icon: Droplets, value: `${user.water.toLocaleString()} L`, label: "Water Saved", color: "text-blue-500" },
            { icon: Zap, value: `${user.energy} MJ`, label: "Energy Saved", color: "text-amber" },
            { icon: ShoppingBag, value: `${user.items}`, label: "Items Thrifted", color: "text-primary" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-xl p-4 shadow-[var(--shadow-card)] text-center">
              <s.icon className={`h-6 w-6 mx-auto mb-2 ${s.color}`} />
              <p className="font-bold text-lg text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Level Progress */}
        <div className="bg-card rounded-xl p-5 shadow-[var(--shadow-card)] mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber" />
              <span className="font-sans font-bold text-primary">Level Progress</span>
            </div>
            <span className="text-xs text-muted-foreground">{user.items}/{nextLevel.items} items to next level</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">Next: {nextLevel.title}</p>
        </div>

        {/* Achievements */}
        <div className="bg-card rounded-xl p-5 shadow-[var(--shadow-card)] mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-amber" />
            <span className="font-sans font-bold text-primary">Achievements</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {achievements.map((a) => (
              <div
                key={a.label}
                className={`rounded-xl p-3 text-center border transition-all ${
                  a.unlocked ? "border-secondary/30 bg-secondary/5" : "border-border bg-muted/30 opacity-50"
                }`}
              >
                <span className="text-2xl block mb-1">{a.emoji}</span>
                <span className="text-xs font-semibold text-foreground">{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-5 w-5 text-primary" />
            <span className="font-sans font-bold text-primary">Recent Activity</span>
          </div>
          <p className="text-sm text-muted-foreground text-center py-6">Sign in to see your order history</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Profile;
