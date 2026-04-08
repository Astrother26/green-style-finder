import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/components/ProductCard";

export async function uploadAndRecommend(file: File, gender: string = "all"): Promise<{
  analysis: { category: string; color: string; style: string; gender: string; fabric: string };
  recommendations: Product[];
}> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("gender", gender);

  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/recommend`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function fetchProducts(filters?: {
  category?: string;
  gender?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase.from("products").select("*").order("match_score", { ascending: false });

  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.gender) query = query.eq("gender", filters.gender);
  if (filters?.limit) query = query.limit(filters.limit);
  if (filters?.offset) query = query.range(filters.offset, filters.offset + (filters?.limit || 12) - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function addToCart(item: {
  product_sku: string;
  product_name: string;
  product_price: number;
  product_image: string;
  carbon_kg: number;
  water_liters: number;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Check if already in cart
  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_sku", item.product_sku)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: (existing.quantity || 1) + 1 })
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      ...item,
      quantity: 1,
    });
    if (error) throw error;
  }
}

export async function getCartItems() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id)
    .order("added_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateCartQuantity(id: string, quantity: number) {
  if (quantity <= 0) {
    const { error } = await supabase.from("cart_items").delete().eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", id);
    if (error) throw error;
  }
}

export async function removeCartItem(id: string) {
  const { error } = await supabase.from("cart_items").delete().eq("id", id);
  if (error) throw error;
}

export async function checkout() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const items = await getCartItems();
  if (!items.length) throw new Error("Cart is empty");

  const subtotal = items.reduce((s, i) => s + (i.product_price || 0) * (i.quantity || 1), 0);
  const totalCarbon = items.reduce((s, i) => s + (i.carbon_kg || 0) * (i.quantity || 1), 0);
  const totalWater = items.reduce((s, i) => s + (i.water_liters || 0) * (i.quantity || 1), 0);
  const totalItems = items.reduce((s, i) => s + (i.quantity || 1), 0);

  const orderNumber = `ECO-${Date.now().toString(36).toUpperCase()}`;

  const { error: orderError } = await supabase.from("orders").insert({
    user_id: user.id,
    order_number: orderNumber,
    items: items as any,
    subtotal,
    tax: Math.round(subtotal * 0.18 * 100) / 100,
    shipping: 0,
    total_price: subtotal + Math.round(subtotal * 0.18 * 100) / 100,
    total_carbon_saved: totalCarbon * 4,
    total_water_saved: totalWater * 3,
  });
  if (orderError) throw orderError;

  // Update profile stats
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile) {
    const newItems = (profile.total_items_purchased || 0) + totalItems;
    let ecoLevel = 1;
    if (newItems >= 200) ecoLevel = 10;
    else if (newItems >= 150) ecoLevel = 9;
    else if (newItems >= 100) ecoLevel = 8;
    else if (newItems >= 75) ecoLevel = 7;
    else if (newItems >= 50) ecoLevel = 6;
    else if (newItems >= 35) ecoLevel = 5;
    else if (newItems >= 20) ecoLevel = 4;
    else if (newItems >= 10) ecoLevel = 3;
    else if (newItems >= 5) ecoLevel = 2;

    const achievements = [...(profile.achievements || [])];
    if (newItems >= 1 && !achievements.includes("🌱 First Purchase")) achievements.push("🌱 First Purchase");
    if (newItems >= 5 && !achievements.includes("♻️ Eco Warrior")) achievements.push("♻️ Eco Warrior");
    if (newItems >= 10 && !achievements.includes("🌍 Planet Saver")) achievements.push("🌍 Planet Saver");
    if (newItems >= 20 && !achievements.includes("👑 Eco Master")) achievements.push("👑 Eco Master");

    await supabase.from("profiles").update({
      total_items_purchased: newItems,
      total_carbon_saved: (profile.total_carbon_saved || 0) + totalCarbon * 4,
      total_water_saved: (profile.total_water_saved || 0) + totalWater * 3,
      eco_level: ecoLevel,
      achievements,
    }).eq("id", user.id);
  }

  // Clear cart
  await supabase.from("cart_items").delete().eq("user_id", user.id);

  return { orderNumber, total: subtotal };
}

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (error) return null;
  return data;
}

export async function createListing(listing: {
  title: string;
  category: string;
  condition: string;
  size: string;
  price: number;
  original_price?: number;
  description: string;
  images: string[];
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("listings").insert({
    user_id: user.id,
    ...listing,
  });
  if (error) throw error;
}

export async function createRental(rental: {
  item_name: string;
  size?: string;
  start_date?: string;
  end_date?: string;
  occasion?: string;
  city?: string;
  phone?: string;
  notes?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("rentals").insert({
    user_id: user.id,
    ...rental,
  });
  if (error) throw error;

  // Update rental count
  const { data: profile } = await supabase.from("profiles").select("total_rentals, achievements").eq("id", user.id).single();
  if (profile) {
    const achievements = [...(profile.achievements || [])];
    if (!achievements.includes("🔑 Renter")) achievements.push("🔑 Renter");
    await supabase.from("profiles").update({
      total_rentals: (profile.total_rentals || 0) + 1,
      achievements,
    }).eq("id", user.id);
  }
}
