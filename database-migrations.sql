-- BoardGameCulture Database Migrations
-- Run these in Supabase SQL Editor to create all tables for Phases 4-10

-- =================================
-- PHASE 4: COMMUNITY DISCUSSIONS
-- =================================

-- Discussion categories enum
CREATE TYPE discussion_category AS ENUM ('rules', 'strategy', 'general', 'marketplace', 'meetups');

-- Discussions table
CREATE TABLE IF NOT EXISTS discussions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  category discussion_category NOT NULL DEFAULT 'general',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  view_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  best_answer_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discussion comments (threaded)
CREATE TABLE IF NOT EXISTS discussion_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES discussion_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  is_best_answer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discussion votes (for tracking user votes)
CREATE TABLE IF NOT EXISTS discussion_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vote_type INT NOT NULL CHECK (vote_type IN (-1, 1)), -- -1 = downvote, 1 = upvote
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(discussion_id, user_id)
);

-- Comment votes
CREATE TABLE IF NOT EXISTS comment_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES discussion_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vote_type INT NOT NULL CHECK (vote_type IN (-1, 1)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Indexes for discussions
CREATE INDEX idx_discussions_user ON discussions(user_id);
CREATE INDEX idx_discussions_community ON discussions(community_id);
CREATE INDEX idx_discussions_category ON discussions(category);
CREATE INDEX idx_discussions_created ON discussions(created_at DESC);
CREATE INDEX idx_discussion_comments_discussion ON discussion_comments(discussion_id);
CREATE INDEX idx_discussion_comments_parent ON discussion_comments(parent_id);

-- =================================
-- PHASE 5: GAME COLLECTIONS & PLAY LOGS
-- =================================

-- Games catalog
CREATE TABLE IF NOT EXISTS games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  min_players INT,
  max_players INT,
  playtime_min INT,
  playtime_max INT,
  age_rating INT,
  complexity DECIMAL(2,1), -- 1.0 to 5.0
  bgg_id INT UNIQUE, -- BoardGameGeek ID
  bgg_rating DECIMAL(3,2),
  image_url TEXT,
  year_published INT,
  designers TEXT[],
  publishers TEXT[],
  categories TEXT[],
  mechanics TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User game collections
CREATE TYPE collection_status AS ENUM ('own', 'want_to_buy', 'played', 'wishlist');

CREATE TABLE IF NOT EXISTS user_games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  status collection_status NOT NULL DEFAULT 'played',
  rating INT CHECK (rating >= 1 AND rating <= 10),
  notes TEXT,
  times_played INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

-- Play logs (game sessions)
CREATE TABLE IF NOT EXISTS play_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_minutes INT,
  location TEXT,
  notes TEXT,
  is_coop BOOLEAN DEFAULT FALSE,
  team_won BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Play log players (for tracking individual scores)
CREATE TABLE IF NOT EXISTS play_log_players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  play_log_id UUID NOT NULL REFERENCES play_logs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  player_name TEXT NOT NULL,
  score INT,
  placement INT, -- 1st, 2nd, 3rd, etc.
  is_winner BOOLEAN DEFAULT FALSE,
  team_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for games
CREATE INDEX idx_games_name ON games(name);
CREATE INDEX idx_user_games_user ON user_games(user_id);
CREATE INDEX idx_user_games_game ON user_games(game_id);
CREATE INDEX idx_play_logs_user ON play_logs(user_id);
CREATE INDEX idx_play_logs_game ON play_logs(game_id);
CREATE INDEX idx_play_logs_played_at ON play_logs(played_at DESC);

-- =================================
-- PHASE 6: SHOPPING DIRECTORY
-- =================================

-- Retailers/Shops
CREATE TABLE IF NOT EXISTS retailers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  website_url TEXT NOT NULL,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  city TEXT,
  shipping_pan_india BOOLEAN DEFAULT FALSE,
  has_physical_store BOOLEAN DEFAULT FALSE,
  affiliate_program TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shopping links (affiliate links)
CREATE TABLE IF NOT EXISTS shopping_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  retailer_id UUID NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
  product_url TEXT NOT NULL,
  affiliate_url TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'INR',
  in_stock BOOLEAN DEFAULT TRUE,
  click_count INT DEFAULT 0,
  last_checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate click tracking
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shopping_link_id UUID NOT NULL REFERENCES shopping_links(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for shopping
CREATE INDEX idx_retailers_city ON retailers(city);
CREATE INDEX idx_shopping_links_game ON shopping_links(game_id);
CREATE INDEX idx_shopping_links_retailer ON shopping_links(retailer_id);
CREATE INDEX idx_affiliate_clicks_link ON affiliate_clicks(shopping_link_id);

-- =================================
-- PHASE 7: REVIEWS & GUIDES
-- =================================

-- Game reviews
CREATE TYPE review_type AS ENUM ('full_review', 'quick_review', 'comparison', 'buyers_guide');

CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  type review_type NOT NULL DEFAULT 'full_review',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 10),
  pros TEXT[],
  cons TEXT[],
  target_audience TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Review comparisons (for comparison articles)
CREATE TABLE IF NOT EXISTS review_comparisons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  comparison_order INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(review_id, game_id)
);

-- Review helpfulness votes
CREATE TABLE IF NOT EXISTS review_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- Indexes for reviews
CREATE INDEX idx_reviews_game ON reviews(game_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_published ON reviews(is_published, created_at DESC);

-- =================================
-- PHASE 8: PHOTO GALLERIES
-- =================================

-- Event photos
CREATE TYPE photo_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS event_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  status photo_status DEFAULT 'pending',
  moderation_notes TEXT,
  file_size_kb INT,
  width INT,
  height INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photo tags (for people, games, etc.)
CREATE TABLE IF NOT EXISTS photo_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_id UUID NOT NULL REFERENCES event_photos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  tag_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for photos
CREATE INDEX idx_event_photos_event ON event_photos(event_id);
CREATE INDEX idx_event_photos_status ON event_photos(status);
CREATE INDEX idx_photo_tags_photo ON photo_tags(photo_id);

-- =================================
-- PHASE 10: PAYMENTS & PAYOUTS
-- =================================

-- Transactions (payment records)
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE transaction_type AS ENUM ('event_ticket', 'platform_fee', 'organizer_payout');

CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  registration_id UUID REFERENCES event_registrations(id) ON DELETE SET NULL,
  type transaction_type NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  platform_fee DECIMAL(10,2) DEFAULT 0,
  organizer_amount DECIMAL(10,2),
  status transaction_status DEFAULT 'pending',
  payment_gateway TEXT, -- 'razorpay', 'stripe', etc.
  gateway_transaction_id TEXT,
  gateway_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Organizer payouts
CREATE TYPE payout_status AS ENUM ('pending', 'approved', 'processing', 'completed', 'rejected');

CREATE TABLE IF NOT EXISTS organizer_payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status payout_status DEFAULT 'pending',
  bank_account_name TEXT NOT NULL,
  bank_account_number TEXT NOT NULL,
  bank_ifsc TEXT NOT NULL,
  admin_notes TEXT,
  processed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Payout transactions link (which transactions are included in a payout)
CREATE TABLE IF NOT EXISTS payout_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payout_id UUID NOT NULL REFERENCES organizer_payouts(id) ON DELETE CASCADE,
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(payout_id, transaction_id)
);

-- Indexes for payments
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_event ON transactions(event_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_organizer_payouts_organizer ON organizer_payouts(organizer_id);
CREATE INDEX idx_organizer_payouts_status ON organizer_payouts(status);

-- =================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =================================

-- Enable RLS on all new tables
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE play_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE play_log_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizer_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_transactions ENABLE ROW LEVEL SECURITY;

-- Discussions: Anyone can read, authenticated users can create
CREATE POLICY "Anyone can view discussions" ON discussions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create discussions" ON discussions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own discussions" ON discussions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own discussions" ON discussions FOR DELETE USING (auth.uid() = user_id);

-- Comments: Anyone can read, authenticated users can create
CREATE POLICY "Anyone can view comments" ON discussion_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON discussion_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON discussion_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON discussion_comments FOR DELETE USING (auth.uid() = user_id);

-- Votes: Users can manage their own votes
CREATE POLICY "Users can view own votes" ON discussion_votes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own votes" ON discussion_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes" ON discussion_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON discussion_votes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own comment votes" ON comment_votes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own comment votes" ON comment_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comment votes" ON comment_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comment votes" ON comment_votes FOR DELETE USING (auth.uid() = user_id);

-- Games: Anyone can read, admins can manage
CREATE POLICY "Anyone can view games" ON games FOR SELECT USING (true);

-- User games: Users can manage their own collections
CREATE POLICY "Users can view own games" ON user_games FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add games to collection" ON user_games FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own games" ON user_games FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own games" ON user_games FOR DELETE USING (auth.uid() = user_id);

-- Play logs: Users can manage their own logs
CREATE POLICY "Users can view own play logs" ON play_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create play logs" ON play_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own play logs" ON play_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own play logs" ON play_logs FOR DELETE USING (auth.uid() = user_id);

-- Shopping: Anyone can read
CREATE POLICY "Anyone can view retailers" ON retailers FOR SELECT USING (true);
CREATE POLICY "Anyone can view shopping links" ON shopping_links FOR SELECT USING (true);

-- Reviews: Anyone can read published, users can manage own
CREATE POLICY "Anyone can view published reviews" ON reviews FOR SELECT USING (is_published = true OR auth.uid() = user_id);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Photos: Anyone can view approved, organizers can upload
CREATE POLICY "Anyone can view approved photos" ON event_photos FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can upload event photos" ON event_photos FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- Transactions: Users can view their own
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);

-- Payouts: Organizers can view their own
CREATE POLICY "Organizers can view own payouts" ON organizer_payouts FOR SELECT USING (auth.uid() = organizer_id);
CREATE POLICY "Organizers can request payouts" ON organizer_payouts FOR INSERT WITH CHECK (auth.uid() = organizer_id);

-- =================================
-- FUNCTIONS & TRIGGERS
-- =================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to tables with updated_at
CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON discussions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_discussion_comments_updated_at BEFORE UPDATE ON discussion_comments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_games_updated_at BEFORE UPDATE ON user_games FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_retailers_updated_at BEFORE UPDATE ON retailers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_shopping_links_updated_at BEFORE UPDATE ON shopping_links FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to increment discussion comment count
CREATE OR REPLACE FUNCTION increment_discussion_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE discussions
  SET comment_count = comment_count + 1
  WHERE id = NEW.discussion_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_comment_count
AFTER INSERT ON discussion_comments
FOR EACH ROW
EXECUTE PROCEDURE increment_discussion_comment_count();

-- Function to decrement discussion comment count
CREATE OR REPLACE FUNCTION decrement_discussion_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE discussions
  SET comment_count = comment_count - 1
  WHERE id = OLD.discussion_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decrement_comment_count
AFTER DELETE ON discussion_comments
FOR EACH ROW
EXECUTE PROCEDURE decrement_discussion_comment_count();
