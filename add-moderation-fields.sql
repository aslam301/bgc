-- Add moderation fields to events table if they don't exist
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'under_review')),
  ADD COLUMN IF NOT EXISTS moderation_flags JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS flagged_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES public.profiles(id);

-- Create index for moderation queries
CREATE INDEX IF NOT EXISTS idx_events_moderation_status ON public.events(moderation_status);

-- Update existing events to have approved moderation status if they're published
UPDATE public.events
SET moderation_status = 'approved'
WHERE status = 'published' AND moderation_status IS NULL;

-- Update existing draft events to have pending moderation status
UPDATE public.events
SET moderation_status = 'pending'
WHERE status = 'draft' AND moderation_status IS NULL;
