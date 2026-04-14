import { useState, useEffect } from "react";
import { MapPin, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Address {
  id: string;
  label: string;
  full_address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string | null;
  is_default: boolean;
}

interface AddressSelectorProps {
  selectedAddressId: string | null;
  onSelect: (id: string) => void;
}

const AddressSelector = ({ selectedAddressId, onSelect }: AddressSelectorProps) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    label: "Home",
    full_address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  useEffect(() => {
    if (user) fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user!.id)
      .order("is_default", { ascending: false });
    if (data) {
      setAddresses(data as Address[]);
      if (data.length > 0 && !selectedAddressId) {
        const def = data.find((a: any) => a.is_default) || data[0];
        onSelect((def as Address).id);
      }
    }
  };

  const handleSave = async () => {
    if (!form.full_address || !form.city || !form.state || !form.pincode) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    const { data, error } = await supabase.from("addresses").insert({
      user_id: user!.id,
      label: form.label,
      full_address: form.full_address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      landmark: form.landmark || null,
      is_default: addresses.length === 0,
    } as any).select().single();

    if (error) {
      toast.error("Failed to save address");
    } else {
      toast.success("Address saved!");
      setShowForm(false);
      setForm({ label: "Home", full_address: "", city: "", state: "", pincode: "", landmark: "" });
      await fetchAddresses();
      if (data) onSelect((data as any).id);
    }
    setSaving(false);
  };

  return (
    <div className="border border-border rounded-2xl p-4 bg-muted/20">
      <h4 className="font-bold text-primary mb-3 flex items-center gap-2 text-sm">
        <MapPin className="h-4 w-4 text-amber" /> Delivery Address
      </h4>

      {addresses.length > 0 && (
        <div className="space-y-2 mb-3">
          {addresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => onSelect(addr.id)}
              className={`w-full text-left rounded-xl p-3 border transition-all text-sm ${
                selectedAddressId === addr.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-primary text-xs">{addr.label}</span>
                {selectedAddressId === addr.id && <Check className="h-4 w-4 text-primary" />}
              </div>
              <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                {addr.full_address}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
            </button>
          ))}
        </div>
      )}

      {!showForm ? (
        <Button variant="outline" size="sm" onClick={() => setShowForm(true)} className="w-full rounded-xl text-xs">
          <Plus className="h-3 w-3 mr-1" /> Add New Address
        </Button>
      ) : (
        <div className="space-y-2 border border-border rounded-xl p-3 bg-card">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Label</Label>
              <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Home" className="rounded-lg h-8 text-xs" />
            </div>
            <div>
              <Label className="text-xs">Pincode *</Label>
              <Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="560001" className="rounded-lg h-8 text-xs" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Full Address *</Label>
            <Input value={form.full_address} onChange={(e) => setForm({ ...form, full_address: e.target.value })} placeholder="House no, street, area" className="rounded-lg h-8 text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">City *</Label>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Bangalore" className="rounded-lg h-8 text-xs" />
            </div>
            <div>
              <Label className="text-xs">State *</Label>
              <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="Karnataka" className="rounded-lg h-8 text-xs" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Landmark</Label>
            <Input value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} placeholder="Near park..." className="rounded-lg h-8 text-xs" />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={saving} className="rounded-lg flex-1 h-8 text-xs">
              {saving ? "Saving..." : "Save Address"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)} className="rounded-lg h-8 text-xs">Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
