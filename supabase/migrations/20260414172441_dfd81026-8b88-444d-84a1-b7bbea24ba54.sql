
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can update availability" ON public.clothing_items;

-- Create a more restrictive policy - only allow updates to availability
-- In practice, availability updates will go through the application logic
CREATE POLICY "Service role can update clothing items"
  ON public.clothing_items FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);
