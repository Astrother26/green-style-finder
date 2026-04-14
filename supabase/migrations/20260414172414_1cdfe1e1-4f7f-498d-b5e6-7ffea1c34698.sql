
-- Create clothing_items table
CREATE TABLE public.clothing_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  size TEXT NOT NULL DEFAULT 'M',
  price_per_day NUMERIC NOT NULL DEFAULT 500,
  image_url TEXT,
  availability BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clothing_items ENABLE ROW LEVEL SECURITY;

-- Anyone can view clothing items
CREATE POLICY "Anyone can view clothing items"
  ON public.clothing_items FOR SELECT
  USING (true);

-- Only service role can insert/update (managed via edge functions or admin)
-- We'll allow authenticated users to update availability when renting
CREATE POLICY "Authenticated users can update availability"
  ON public.clothing_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add clothing_item_id and total_price to rentals
ALTER TABLE public.rentals
  ADD COLUMN IF NOT EXISTS clothing_item_id UUID REFERENCES public.clothing_items(id),
  ADD COLUMN IF NOT EXISTS total_price NUMERIC;
