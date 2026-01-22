-- Seed Events SQL Script
-- Run this in Supabase SQL Editor to create sample events

-- First, create a test organizer (only if you don't have one)
-- Replace with your actual user ID after signup

-- Insert sample events
INSERT INTO public.events (
  title,
  description,
  organizer_id,
  location_city,
  location_venue,
  location_address,
  start_date,
  ticket_price,
  max_attendees,
  status,
  moderation_status
) VALUES
(
  'Catan Tournament - Mumbai Edition',
  'Join us for an exciting Settlers of Catan tournament! Compete with fellow board game enthusiasts and win amazing prizes. All skill levels welcome!',
  (SELECT id FROM public.profiles LIMIT 1), -- Uses first user as organizer
  'Mumbai',
  'Board Game Cafe',
  'Bandra West, Mumbai, Maharashtra',
  NOW() + INTERVAL '7 days',
  299.00,
  20,
  'published',
  'approved'
),
(
  'Ticket to Ride India Championship',
  'Experience the thrill of Ticket to Ride India edition. Build your railway empire across the Indian subcontinent!',
  (SELECT id FROM public.profiles LIMIT 1),
  'Delhi',
  'Game Hub Delhi',
  'Connaught Place, New Delhi',
  NOW() + INTERVAL '10 days',
  399.00,
  16,
  'published',
  'approved'
),
(
  'Free Board Game Night - Bangalore',
  'Casual board game meetup for enthusiasts. Bring your favorite games or play from our collection. Free snacks included!',
  (SELECT id FROM public.profiles LIMIT 1),
  'Bangalore',
  'Tech Park Community Hall',
  'Whitefield, Bangalore, Karnataka',
  NOW() + INTERVAL '3 days',
  0.00,
  30,
  'published',
  'approved'
),
(
  'Pandemic Legacy Campaign - Pune',
  'Join our ongoing Pandemic Legacy campaign. New players welcome, we''ll catch you up on the story!',
  (SELECT id FROM public.profiles LIMIT 1),
  'Pune',
  'Boardgame Cafe Pune',
  'Koregaon Park, Pune, Maharashtra',
  NOW() + INTERVAL '5 days',
  0.00,
  6,
  'published',
  'approved'
),
(
  'Wingspan Tournament',
  'Bird enthusiasts unite! Compete in this beautiful engine-building game. Prizes for top 3 players.',
  (SELECT id FROM public.profiles LIMIT 1),
  'Hyderabad',
  'Dice & Tokens',
  'Jubilee Hills, Hyderabad, Telangana',
  NOW() + INTERVAL '14 days',
  499.00,
  12,
  'published',
  'approved'
),
(
  'Codenames Party Night - Chennai',
  'Fun-filled evening of Codenames and social deduction games. Perfect for beginners and experts alike!',
  (SELECT id FROM public.profiles LIMIT 1),
  'Chennai',
  'Game Point Chennai',
  'T Nagar, Chennai, Tamil Nadu',
  NOW() + INTERVAL '4 days',
  150.00,
  24,
  'published',
  'approved'
);

-- Verify events were created
SELECT COUNT(*) as total_events FROM public.events WHERE status = 'published';
