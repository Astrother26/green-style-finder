import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, Droplets, Zap, Trophy, Award, ShoppingBag, CalendarDays, Loader2, MapPin, Plus, Pencil, Trash2, Phone, Mail, User, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { getProfile } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

const statusColors: Record<string, string> = {
  pending: "bg-amber/20 text-amber border-amber/30",
  booked: "bg-blue-100 text-blue-700 border-blue-200",
  ongoing: "bg-secondary/20 text-secondary border-secondary/30",
  returned: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

interface Address {
  id: string; label: string; full_address: string; city: string; state: string; pincode: string; landmark: string | null; is_default: boolean;
}

interface Rental {
  id: string; item_name: string; start_date: string | null; end_date: string | null; total_price: number | null; status: string | null; created_at: string | null;
  clothing_items?: { image_url: string | null } | null;
}

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ label: "Home", full_address: "", city: "", state: "", pincode: "", landmark: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    Promise.all([
      getProfile(),
      supabase.from("addresses").select("*").eq("user_id", user.id).order("is_default", { ascending: false }),
      supabase.from("rentals").select("*, clothing_items(image_url)").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]).then(([prof, addrRes, rentalRes]) => {
      setProfile(prof);
      setProfileForm({ name: prof?.name || user.user_metadata?.name || "", phone: (prof as any)?.phone || "" });
      setAddresses((addrRes.data || []) as Address[]);
      setRentals((rentalRes.data || []) as Rental[]);
    }).finally(() => setLoading(false));
  }, [user]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const { error } = await supabase.from("profiles").update({ name: profileForm.name, phone: profileForm.phone } as any).eq("id", user!.id);
    if (error) toast.error("Failed to update profile");
    else { toast.success("Profile updated!"); setEditingProfile(false); setProfile({ ...profile, name: profileForm.name, phone: profileForm.phone }); }
    setSavingProfile(false);
  };

  const handleSaveAddress = async () => {
    if (!addressForm.full_address || !addressForm.city || !addressForm.state || !addressForm.pincode) { toast.error("Fill all required fields"); return; }
    setSavingAddress(true);
    const { data, error } = await supabase.from("addresses").insert({
      user_id: user!.id, ...addressForm, landmark: addressForm.landmark || null, is_default: addresses.length === 0,
    } as any).select().single();
    if (error) toast.error("Failed to save address");
    else {
      setAddresses([...addresses, data as any as Address]);
      setShowAddressForm(false);
      setAddressForm({ label: "Home", full_address: "", city: "", state: "", pincode: "", landmark: "" });
      toast.success("Address saved!");
    }
    setSavingAddress(false);
  };

  const handleDeleteAddress = async (id: string) => {
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (!error) { setAddresses(addresses.filter((a) => a.id !== id)); toast.success("Address removed"); }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col"><Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Sign in to view your profile</p>
            <Button onClick={() => navigate("/login")} className="bg-primary text-primary-foreground rounded-full">Sign In</Button>
          </div>
        </div><Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col"><Navbar />
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
        {/* User Details Card */}
        <div className="bg-card rounded-xl p-5 shadow-[var(--shadow-card)] mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /><span className="font-sans font-bold text-primary">Profile Details</span></div>
            {!editingProfile && <Button variant="ghost" size="sm" onClick={() => setEditingProfile(true)}><Pencil className="h-4 w-4" /></Button>}
          </div>
          {editingProfile ? (
            <div className="space-y-3">
              <div><Label className="text-xs">Name</Label><Input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="rounded-xl" /></div>
              <div><Label className="text-xs">Phone</Label><Input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="+91 98765 43210" className="rounded-xl" /></div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveProfile} disabled={savingProfile} className="rounded-xl">{savingProfile ? "Saving..." : "Save"}</Button>
                <Button size="sm" variant="outline" onClick={() => setEditingProfile(false)} className="rounded-xl">Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" />{user.email}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" />{(p as any).phone || "Not set"}</div>
            </div>
          )}
        </div>

        {/* Eco Stats */}
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

        {/* Level Progress */}
        <div className="bg-card rounded-xl p-5 shadow-[var(--shadow-card)] mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><Trophy className="h-5 w-5 text-amber" /><span className="font-sans font-bold text-primary">Level Progress</span></div>
            <span className="text-xs text-muted-foreground">{p.total_items_purchased}/{nextThreshold} items</span>
          </div>
          <Progress value={Math.min(100, progress)} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">Next: {levelTitles[p.eco_level + 1] || "Max Level!"}</p>
        </div>

        {/* Achievements */}
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

        {/* Saved Addresses */}
        <div className="bg-card rounded-xl p-5 shadow-[var(--shadow-card)] mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /><span className="font-sans font-bold text-primary">Saved Addresses</span></div>
            <Button variant="ghost" size="sm" onClick={() => setShowAddressForm(true)}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </div>
          {addresses.length === 0 && !showAddressForm && (
            <p className="text-sm text-muted-foreground text-center py-4">No saved addresses yet.</p>
          )}
          <div className="space-y-2">
            {addresses.map((addr) => (
              <div key={addr.id} className="flex items-start justify-between border border-border rounded-xl p-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-primary">{addr.label}</span>
                    {addr.is_default && <Badge variant="secondary" className="text-[10px] h-5">Default</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{addr.full_address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  {addr.landmark && <p className="text-xs text-muted-foreground">Near: {addr.landmark}</p>}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteAddress(addr.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
          {showAddressForm && (
            <div className="mt-3 border border-border rounded-xl p-4 bg-muted/20 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div><Label className="text-xs">Label</Label><Input value={addressForm.label} onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })} className="rounded-lg h-8 text-xs" /></div>
                <div><Label className="text-xs">Pincode *</Label><Input value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} className="rounded-lg h-8 text-xs" /></div>
              </div>
              <div><Label className="text-xs">Full Address *</Label><Input value={addressForm.full_address} onChange={(e) => setAddressForm({ ...addressForm, full_address: e.target.value })} className="rounded-lg h-8 text-xs" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label className="text-xs">City *</Label><Input value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="rounded-lg h-8 text-xs" /></div>
                <div><Label className="text-xs">State *</Label><Input value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="rounded-lg h-8 text-xs" /></div>
              </div>
              <div><Label className="text-xs">Landmark</Label><Input value={addressForm.landmark} onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })} className="rounded-lg h-8 text-xs" /></div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveAddress} disabled={savingAddress} className="rounded-lg h-8 text-xs flex-1">{savingAddress ? "Saving..." : "Save"}</Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddressForm(false)} className="rounded-lg h-8 text-xs">Cancel</Button>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity / Rental History */}
        <div className="bg-card rounded-xl p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 mb-4"><Package className="h-5 w-5 text-primary" /><span className="font-sans font-bold text-primary">Recent Activity</span></div>
          {rentals.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Start renting to build your activity history! 🌱</p>
          ) : (
            <div className="space-y-3">
              {rentals.map((r) => (
                <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 border border-border rounded-xl p-3">
                  <div className="w-14 h-14 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                    <img
                      src={r.clothing_items?.image_url || "/placeholder.svg"}
                      alt={r.item_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-primary truncate">{r.item_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.start_date && r.end_date ? `${new Date(r.start_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${new Date(r.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : "Dates TBD"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm text-foreground">₹{(r.total_price || 0).toLocaleString("en-IN")}</p>
                    <Badge className={`text-[10px] border ${statusColors[r.status || "pending"] || statusColors.pending}`}>
                      {(r.status || "pending").charAt(0).toUpperCase() + (r.status || "pending").slice(1)}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Profile;
