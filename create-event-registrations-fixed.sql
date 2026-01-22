-- Drop table if exists (clean up any partial creations)
DROP TABLE IF EXISTS public.event_registrations CASCADE;

-- Create event_registrations table
CREATE TABLE public.event_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID NOT NULL,
  user_id UUID NOT NULL,
  status TEXT DEFAULT 'confirmed',
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraints
ALTER TABLE public.event_registrations
  ADD CONSTRAINT fk_event_registrations_event
  FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE public.event_registrations
  ADD CONSTRAINT fk_event_registrations_user
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add check constraint for status
ALTER TABLE public.event_registrations
  ADD CONSTRAINT check_status
  CHECK (status IN ('confirmed', 'pending_payment', 'cancelled'));

-- Create indexes for performance
CREATE INDEX idx_event_registrations_event ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_user ON public.event_registrations(user_id);
CREATE INDEX idx_event_registrations_status ON public.event_registrations(status);

-- Prevent duplicate registrations (same user for same event)
CREATE UNIQUE INDEX idx_unique_event_user ON public.event_registrations(event_id, user_id);

-- Enable Row Level Security
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Policies for event_registrations
-- Users can view their own registrations
CREATE POLICY "Users can view own registrations"
  ON public.event_registrations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can register for events
CREATE POLICY "Users can register for events"
  ON public.event_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own registrations (for cancellation)
CREATE POLICY "Users can update own registrations"
  ON public.event_registrations FOR UPDATE
  USING (auth.uid() = user_id);

-- Organizers can view registrations for their events
CREATE POLICY "Organizers can view event registrations"
  ON public.event_registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_registrations.event_id
      AND events.organizer_id = auth.uid()
    )
  );
