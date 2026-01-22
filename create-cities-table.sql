-- Create cities table for dropdown management
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  state TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active cities
CREATE POLICY "Anyone can view active cities"
  ON public.cities FOR SELECT
  USING (is_active = true);

-- Only super admins can insert cities
CREATE POLICY "Super admins can insert cities"
  ON public.cities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- Only super admins can update cities
CREATE POLICY "Super admins can update cities"
  ON public.cities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_cities_active ON public.cities(is_active);
CREATE INDEX IF NOT EXISTS idx_cities_name ON public.cities(name);

-- Insert default Indian cities
INSERT INTO public.cities (name, state, display_order) VALUES
  ('Bangalore', 'Karnataka', 1),
  ('Mumbai', 'Maharashtra', 2),
  ('Delhi', 'Delhi', 3),
  ('Hyderabad', 'Telangana', 4),
  ('Chennai', 'Tamil Nadu', 5),
  ('Pune', 'Maharashtra', 6),
  ('Kolkata', 'West Bengal', 7),
  ('Ahmedabad', 'Gujarat', 8),
  ('Gurgaon', 'Haryana', 9),
  ('Noida', 'Uttar Pradesh', 10)
ON CONFLICT (name) DO NOTHING;
