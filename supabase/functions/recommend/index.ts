import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMISSION_FACTORS: Record<string, { co2: number; water: number; energy: number; grade: string }> = {
  cotton: { co2: 7.5, water: 2967, energy: 158, grade: "B" },
  organic_cotton: { co2: 4.1, water: 254, energy: 60, grade: "A" },
  recycled_cotton: { co2: 1.5, water: 148, energy: 47, grade: "A+" },
  linen: { co2: 3.4, water: 738, energy: 184, grade: "A" },
  hemp: { co2: 1.78, water: 1.46, energy: 2.1, grade: "A+" },
  wool: { co2: 13.0, water: 272, energy: 103, grade: "D" },
  silk: { co2: 11.5, water: 1000, energy: 140, grade: "D" },
  leather: { co2: 110, water: 17000, energy: 200, grade: "F" },
  polyester: { co2: 4.4, water: 26, energy: 97, grade: "C" },
  recycled_polyester: { co2: 1.2, water: 5, energy: 13, grade: "A+" },
  nylon: { co2: 10.2, water: 40, energy: 150, grade: "D" },
  acrylic: { co2: 9.5, water: 120, energy: 150, grade: "D" },
  viscose: { co2: 5.0, water: 400, energy: 120, grade: "C" },
  lyocell: { co2: 3.0, water: 200, energy: 80, grade: "A" },
};

const GARMENT_WEIGHTS: Record<string, number> = {
  tshirt: 0.17, "t-shirt": 0.17, tee: 0.17,
  shirt: 0.23, blouse: 0.23,
  jeans: 0.79, denim: 0.79, trousers: 0.56, pants: 0.56,
  dress: 0.475, skirt: 0.34,
  jacket: 0.68, coat: 1.68, blazer: 0.68,
  sweater: 0.45, hoodie: 0.90, sweatshirt: 0.90,
  shorts: 0.20,
  default: 0.40,
};

function calculateCarbon(fabric: string, category: string) {
  const mat = fabric.toLowerCase().replace(/\s+/g, "_");
  const factors = EMISSION_FACTORS[mat] || EMISSION_FACTORS["cotton"];
  const weight = GARMENT_WEIGHTS[category.toLowerCase()] || GARMENT_WEIGHTS["default"];
  const carbon_kg = parseFloat((factors.co2 * weight).toFixed(2));
  const water_liters = parseFloat((factors.water * weight).toFixed(0));
  const energy_mj = parseFloat((factors.energy * weight).toFixed(0));
  const score = Math.max(0, Math.min(100, 100 - carbon_kg * 5));
  return { carbon_kg, water_liters, energy_mj, sustainability_grade: factors.grade, sustainability_score: Math.round(score) };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const SERPAPI_KEY = Deno.env.get("SERPAPI_KEY");
    if (!SERPAPI_KEY) throw new Error("SERPAPI_KEY not configured");

    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const gender = (formData.get("gender") as string) || "all";

    if (!imageFile) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Convert image to base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    const mimeType = imageFile.type || "image/jpeg";

    // Call Lovable AI Gateway (Gemini) for image analysis
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: 'Analyze this clothing image. Return ONLY valid JSON: {"category":"","color":"","style":"","gender":"","fabric":""}. category should be one of: tshirt, shirt, blouse, jeans, dress, skirt, jacket, coat, sweater, hoodie, shorts, pants. gender should be: women, men, or unisex. fabric should be the most likely material.',
              },
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${base64}` },
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_clothing",
              description: "Extract clothing attributes from image",
              parameters: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  color: { type: "string" },
                  style: { type: "string" },
                  gender: { type: "string", enum: ["women", "men", "unisex"] },
                  fabric: { type: "string" },
                },
                required: ["category", "color", "style", "gender", "fabric"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_clothing" } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI analysis failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let analysis: { category: string; color: string; style: string; gender: string; fabric: string };

    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      analysis = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback: try parsing content
      const content = aiData.choices?.[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { category: "dress", color: "unknown", style: "casual", gender: "unisex", fabric: "cotton" };
    }

    // Build SerpAPI search
    const searchGender = gender !== "all" ? gender : analysis.gender;
    const searchQuery = `${analysis.color} ${analysis.style} ${analysis.category} ${searchGender} thrift secondhand`;

    const serpUrl = new URL("https://serpapi.com/search");
    serpUrl.searchParams.set("engine", "google_shopping");
    serpUrl.searchParams.set("q", searchQuery);
    serpUrl.searchParams.set("api_key", SERPAPI_KEY);
    serpUrl.searchParams.set("gl", "in");
    serpUrl.searchParams.set("hl", "en");
    serpUrl.searchParams.set("num", "20");

    const serpResponse = await fetch(serpUrl.toString());
    const serpData = await serpResponse.json();

    const shoppingResults = serpData.shopping_results || [];
    const recommendations = shoppingResults.slice(0, 8).map((item: any, i: number) => {
      const fabric = analysis.fabric || "cotton";
      const carbon = calculateCarbon(fabric, analysis.category);
      const price = parseFloat(String(item.price || "0").replace(/[^0-9.]/g, "")) || 999;
      return {
        name: item.title || `${analysis.category} Item`,
        brand: item.source || "Unknown",
        price: Math.round(price),
        currency: "INR",
        image_url: item.thumbnail || "",
        source_url: item.link || "",
        category: analysis.category,
        gender: analysis.gender,
        fabric,
        ...carbon,
        match_score: parseFloat((0.95 - i * 0.03).toFixed(2)),
        sku: `serp-${Date.now()}-${i}`,
      };
    });

    // Cache in Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (recommendations.length > 0) {
      const toInsert = recommendations.map((r: any) => ({
        sku: r.sku, name: r.name, brand: r.brand, category: r.category,
        gender: r.gender, price: r.price, image_url: r.image_url,
        source_url: r.source_url, fabric: r.fabric, carbon_kg: r.carbon_kg,
        water_liters: r.water_liters, energy_mj: r.energy_mj,
        sustainability_score: r.sustainability_score,
        sustainability_grade: r.sustainability_grade, match_score: r.match_score,
      }));
      await supabase.from("products").upsert(toInsert, { onConflict: "sku" });
    }

    return new Response(JSON.stringify({
      success: true,
      analysis,
      recommendations,
      count: recommendations.length,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("recommend error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
