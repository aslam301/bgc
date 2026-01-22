# Board Game Culture - Project Plan

## Project Overview

**Project Name:** Board Game Culture
**Start Date:** 2026-01-22
**Status:** Planning Phase

### Vision
Build a comprehensive board game community platform for India - combining event discovery & ticketing, community discussions, game collections, reviews, and shopping guides. Think: Meetup + Eventbrite + BoardGameGeek + Stack Overflow for Indian board gamers.

### Core Features
1. **Event Management** - City-wise board game events (Luna.com/MakeMyPass style)
2. **Community Discussions** - Rules, strategy, general discussions (Stack Overflow style)
3. **Shopping Directory** - Where to buy board games in India (with affiliate links, disclosed)
4. **Reviews & Guides** - Game reviews, comparisons, buyer's guides
5. **Game Collections** - Personal and community game lists with play logs & scorecards
6. **Photo Galleries** - Event photos with organizer uploads and tagging
7. **Multi-tenant Communities** - Community pages with assigned admins
8. **Payment Processing** - Event registration and organizer payouts
9. **Admin Dashboard** - Central monitoring and content management

---

## Milestones

### Phase 1: Foundation & Core Infrastructure
**Target:** TBD
**Status:** Not Started

#### Setup
- [ ] Initialize frontend project (Next.js/Nuxt with SSR)
- [ ] Initialize backend API (Node.js/NestJS or similar)
- [ ] Set up PostgreSQL database
- [ ] Set up Redis for caching/sessions
- [ ] Authentication system (JWT + OAuth)
- [ ] Authorization & role-based access control (RBAC)
- [ ] File storage solution (S3/CloudFlare R2 for images)
- [ ] CDN setup for image delivery
- [ ] Email service integration
- [ ] CI/CD pipeline
- [ ] Design system and component library

#### Database Schema Design
- [ ] Users (profiles, roles, permissions)
- [ ] Communities (multi-tenant structure)
- [ ] Events (with locations, dates, tickets)
- [ ] Games (catalog with metadata)
- [ ] Game collections (user & community lists)
- [ ] Play logs & scorecards
- [ ] Discussion posts & comments
- [ ] Reviews & comparisons
- [ ] Shopping links (affiliate tracking)
- [ ] Transactions & payouts
- [ ] Images & galleries

### Phase 2: User Management & Authentication
**Target:** 2026-01-22
**Status:** ✅ COMPLETED

- [x] User registration & login
- [x] Server actions for auth (login, signup, logout)
- [x] Protected routes (dashboard)
- [x] User profiles (auto-created via trigger)
- [x] User roles implementation (stored in profiles table)
- [x] Basic user dashboard with stats
- [ ] Email verification (deferred to later)
- [ ] Password reset flow (deferred to later)
- [ ] Profile settings & editing (deferred to later)
- [ ] Avatar upload (deferred to later)

### Phase 3: Event Management System
**Target:** 2026-01-22
**Status:** 🔄 IN PROGRESS

#### Event Discovery
- [x] Events listing page (city-wise filtering)
- [x] Event detail page
- [ ] Event search & filters (date, location, game type)
- [ ] Calendar view
- [ ] Map integration (optional)

#### Event Creation & Management
- [x] Event creation form (organizers) with rich text editor (Tiptap)
- [x] Ticket types & pricing
- [x] Attendee limits
- [x] Event moderation workflow (pending approval)
- [ ] Event edit & cancellation
- [ ] Event dashboard for organizers
- [ ] Attendee list & check-in

#### Event Registration & Payments
- [x] Basic registration flow for free events
- [x] Registration flow for paid events (pending payment integration)
- [ ] Payment gateway integration (Razorpay/Stripe) - deferred
- [ ] Order confirmation emails
- [ ] Digital tickets/QR codes
- [ ] Refund handling

### Phase 4: Community Discussion Platform
**Target:** TBD
**Status:** Not Started

- [ ] Discussion categories (Rules, Strategy, General)
- [ ] Create discussion post
- [ ] Threaded comments/replies
- [ ] Voting system (upvote/downvote)
- [ ] Best answer marking (for rules questions)
- [ ] Search discussions
- [ ] Tag system
- [ ] User reputation system (optional)
- [ ] Moderation tools (flag, delete, ban)

### Phase 5: Game Collections & Play Logs
**Target:** TBD
**Status:** Not Started

#### Personal Collections
- [ ] "My Games" list for users
- [ ] Add games to collection
- [ ] Mark as: Own, Want to Buy, Played
- [ ] Personal notes on games

#### Community Collections
- [ ] Community game library list
- [ ] Community admins can manage collection

#### Play Logs & Scorecards
- [ ] Log a game session
- [ ] Record players and scores
- [ ] Support for co-op games (win/lose only)
- [ ] Session notes & photos
- [ ] Play history & statistics
- [ ] Game session sharing

### Phase 6: Shopping Directory & Affiliate System
**Target:** TBD
**Status:** Not Started

- [ ] Shopping page listing retailers
- [ ] Add affiliate links (disclosed)
- [ ] Track affiliate clicks
- [ ] Price comparison (if data available)
- [ ] "Where to Buy" widget on game pages
- [ ] Affiliate disclosure page

### Phase 7: Reviews, Comparisons & Guides
**Target:** TBD
**Status:** Not Started

- [ ] Game review page template
- [ ] Comparison page with tables
- [ ] Buyer's guides
- [ ] "Who should buy" sections
- [ ] Search & filter reviews
- [ ] User ratings (optional)

### Phase 8: Photo Gallery System
**Target:** TBD
**Status:** Not Started

- [ ] Event photo upload (organizers)
- [ ] Image optimization & thumbnails
- [ ] Photo tagging (people, games, locations)
- [ ] Gallery view for each event
- [ ] Photo moderation (admin approval)
- [ ] Storage quota management per organizer
- [ ] Compression & CDN delivery

### Phase 9: Multi-Tenant Community Management
**Target:** TBD
**Status:** Not Started

#### Community Pages
- [ ] Community creation (admin only)
- [ ] Community profile pages
- [ ] Assign community admins
- [ ] Community posts & announcements
- [ ] Community events
- [ ] Community game lists
- [ ] Community branding (logo, colors)

#### Community Admin Tools
- [ ] Member management
- [ ] Post moderation
- [ ] Event management
- [ ] Payment slab configuration
- [ ] Community settings

### Phase 10: Payment & Payout System
**Target:** TBD
**Status:** Not Started

#### Payment Processing
- [ ] Razorpay/Stripe integration
- [ ] Transaction tracking
- [ ] Platform fee calculation
- [ ] GST/tax handling

#### Organizer Payouts
- [ ] Organizer earnings dashboard
- [ ] Payout request system
- [ ] Manual payout approval (admin)
- [ ] Payout history & reports
- [ ] Automated payout (future)
- [ ] Bank account verification

### Phase 11: Admin Dashboard
**Target:** TBD
**Status:** Not Started

- [ ] Overview/analytics dashboard
- [ ] User management (view, edit, suspend)
- [ ] Community management (create, edit, assign admins)
- [ ] Event monitoring & moderation
- [ ] Content moderation (posts, comments, photos)
- [ ] Shopping links management
- [ ] Transaction monitoring
- [ ] Payout approval interface
- [ ] Reports & analytics
- [ ] System settings

### Phase 12: Enhancement & Optimization
**Target:** TBD
**Status:** Not Started

- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Email notifications system
- [ ] Push notifications (optional)
- [ ] Newsletter subscription
- [ ] Social media sharing
- [ ] Analytics integration
- [ ] Mobile responsiveness polish
- [ ] Accessibility improvements
- [ ] Security audit

---

## Immediate Next Steps

### 1. Technology Stack Decision

**Frontend**
- Next.js (React with SSR) or Nuxt (Vue with SSR)
- Tailwind CSS for styling
- shadcn/ui or similar component library

**Backend**
- Node.js with Express/NestJS or similar
- TypeScript for type safety
- REST API or GraphQL

**Database**
- PostgreSQL (main database)
- Redis (caching, sessions, queues)
- Prisma or TypeORM for ORM

**File Storage**
- AWS S3 / CloudFlare R2 / Supabase Storage
- CloudFlare CDN for image delivery

**Payment Gateway**
- Razorpay (India-focused) or Stripe

**Authentication**
- NextAuth.js / Passport.js
- JWT tokens
- OAuth providers (Google, Facebook optional)

**Hosting**
- Vercel/Netlify (frontend)
- Railway/Render/AWS (backend)
- Supabase (alternative all-in-one option)

### 2. Database Schema Planning
- [ ] Design ER diagram
- [ ] Define core entities and relationships
- [ ] Plan multi-tenancy approach
- [ ] Design permission system

### 3. Wireframes & User Flows
- [ ] Homepage
- [ ] Event listing & detail pages
- [ ] Discussion forum layout
- [ ] Admin dashboard
- [ ] Community management interface
- [ ] Payment & checkout flow
- [ ] Organizer payout dashboard

### 4. MVP Scope Definition

**Phase 1 MVP - Core Event Platform**
- ✓ User registration & authentication
- ✓ Event listing page (city-wise)
- ✓ Event creation (basic form)
- ✓ Event detail page
- ✓ Ticket purchase flow
- ✓ Payment gateway integration (Razorpay)
- ✓ Basic user dashboard (my events)
- ✓ Basic organizer dashboard (my organized events, attendees)
- ✓ Basic admin panel (event approval, user management)

**Phase 2 MVP - Community Features**
- Community discussion forum (basic)
- Game database (manual entry)
- Reviews & comparisons (basic)
- Shopping directory (affiliate links)

**Phase 3 MVP - Advanced Features**
- Game collections & play logs
- Photo galleries
- Multi-tenant communities
- Organizer payouts
- Advanced admin features

**Deferred/Future**
- Mobile app
- Advanced search/filtering
- Real-time notifications
- Social features (following, activity feed)
- Gamification (badges, achievements)

---

## Current Sprint

**Sprint:** Sprint 1 - Planning & Architecture
**Dates:** 2026-01-22 onwards
**Goal:** Finalize architecture decisions and set up development environment

### To Do
- [ ] Finalize technology stack decision
- [ ] Create detailed ER diagram for database schema
- [ ] Set up frontend project (Next.js)
- [ ] Set up backend project (NestJS/Express)
- [ ] Configure PostgreSQL database
- [ ] Set up authentication flow
- [ ] Create basic wireframes for key pages
- [ ] Set up Git repository with proper structure
- [ ] Configure CI/CD pipeline

### In Progress
- Comprehensive project planning
- Technology stack evaluation

### Blocked
- None

### Completed
- ✓ Project structure created
- ✓ Vision and goals defined (comprehensive platform)
- ✓ 12-phase development plan documented
- ✓ Platform structure & pages outlined
- ✓ User roles & permissions defined
- ✓ Core data models documented
- ✓ Technical considerations outlined
- ✓ MVP scope defined

---

## Design Requirements

### Visual Style
- Clean, minimal, editorial / magazine-style layout
- No aggressive ads or popups
- Clear typography with good readability
- Light color palette with subtle board-game-inspired accents
- Fully mobile-friendly and responsive

### Content Style Guidelines
- Authoritative and practical tone
- Based on real play experience
- Written for hobbyists and adults
- Focused on Indian board gaming realities
- Avoid hype, clickbait, and generic "Top 10" language
- Professional affiliate integration (not spammy)

---

## Platform Structure

### 1. Public Pages

#### Homepage
- Hero section with value proposition
- Upcoming events (city-wise)
- Featured discussions
- Active communities
- Recent reviews/guides
- CTA: Register, Browse Events, Join Community

#### Events
- `/events` - Event listing (filterable by city, date, game type)
- `/events/[city]` - City-specific events
- `/events/[id]` - Event detail page with registration
- `/events/create` - Event creation (logged-in organizers)

#### Discussions
- `/discussions` - Forum homepage (categories: Rules, Strategy, General)
- `/discussions/[category]` - Category view
- `/discussions/[id]` - Discussion thread with answers/comments
- `/discussions/ask` - Create new discussion

#### Games
- `/games` - Browse all games
- `/games/[id]` - Game detail page with reviews, where to buy
- `/reviews` - All reviews & comparisons
- `/reviews/[id]` - Individual review/comparison

#### Shopping
- `/shop` - Shopping directory (retailers, affiliate links)
- `/shop/[game-id]` - Where to buy specific game

#### Communities
- `/communities` - List of all communities
- `/communities/[slug]` - Community page (posts, events, game list)

### 2. User Dashboard

#### My Account (`/dashboard`)
- Profile settings
- My events (registered & organized)
- My game collection
- My play logs
- My discussions
- Notifications

#### My Games (`/dashboard/games`)
- Personal game collection
- Play history
- Add/edit games

#### My Events (`/dashboard/events`)
- Events I'm attending
- My bookings & tickets

### 3. Organizer Dashboard

#### Organizer Panel (`/organizer`)
- My organized events
- Create new event
- Event analytics (views, registrations)
- Attendee management
- Earnings & payouts
- Photo galleries for events

#### Earnings & Payouts (`/organizer/payouts`)
- Total earnings
- Available balance
- Payout history
- Request payout
- Transaction details

### 4. Community Admin Dashboard

#### Community Management (`/community/[slug]/admin`)
- Community settings
- Member management
- Posts & announcements
- Events management
- Game library management
- Community branding

### 5. Super Admin Dashboard

#### Admin Panel (`/admin`)
- Overview & analytics
- User management
- Community management (create, edit, assign admins)
- Event moderation
- Content moderation (discussions, comments, photos)
- Shopping links management
- Transaction monitoring
- Payout approvals
- System settings
- Reports

---

## Technology Stack (FINALIZED - Cost-Optimized)

> **Philosophy:** Start with $0-5/month, scale only when revenue justifies it. Accept technical debt with clear migration paths.

### ✅ Phase 1: MVP Stack (Hobby/Bootstrap Mode)

#### Frontend
- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (free, copy-paste components)
- **Forms:** React Hook Form + Zod validation
- **API Client:** Supabase JS Client (direct DB queries initially)
- **Hosting:** **Vercel Free Tier**
  - Free for personal projects
  - Unlimited bandwidth for non-commercial
  - Auto SSL, global CDN
  - **Cost:** $0

#### Backend & Database
- **All-in-One:** **Supabase Free Tier**
  - PostgreSQL Database (500MB, upgradeable)
  - Built-in Authentication (email, OAuth)
  - Row Level Security (RLS) for permissions
  - Storage (1GB) for images/files
  - Edge Functions (Deno) for custom logic
  - Real-time subscriptions
  - **Cost:** $0 (upgrades to $25/month Pro when needed)

- **Alternative Backend (when scaling):** Nest.js/Express on Railway
  - Technical debt: Start without custom backend
  - Migration: Build API layer when Supabase Edge Functions become limiting

#### File Storage & CDN
- **Primary:** **Supabase Storage** (1GB free)
  - Automatic image transformations
  - Built-in CDN
  - **Cost:** $0

- **Overflow:** **Cloudflare R2** (10GB free, no egress fees)
  - No bandwidth charges (huge savings vs S3)
  - Only pay for storage after 10GB ($0.015/GB/month)
  - **Cost:** $0-3/month

#### Payment Gateway
- **Provider:** **Razorpay** (India-focused)
  - No setup fees
  - 2% transaction fee only
  - Free test mode
  - **Cost:** $0 (pay only on transactions)

#### Email Service
- **Provider:** **Resend**
  - 3,000 emails/month free
  - 100 emails/day free
  - Clean API, great DX
  - **Cost:** $0 (upgrades to $20/month when needed)

- **Alternative:** **Supabase + SMTP.js** (completely free, lower deliverability)

#### Monitoring & Analytics
- **Error Tracking:** Sentry Free Tier (5k events/month)
- **Analytics:** Vercel Analytics (free) or self-hosted Umami
- **Logs:** Vercel logs (free tier)
- **Cost:** $0

#### Version Control & CI/CD
- **Git:** GitHub (free for public/private repos)
- **CI/CD:** GitHub Actions (2,000 minutes/month free)
- **Cost:** $0

#### Domain
- **Domain:** Namecheap/Cloudflare ($8-12/year for .com)
- **SSL:** Free (via Vercel/Cloudflare)
- **Cost:** ~$1/month

---

### 📊 Total Monthly Cost Breakdown

| Service | Free Tier Limits | Cost (MVP) | Cost (Growth) |
|---------|-----------------|------------|---------------|
| Vercel | Generous for personal | $0 | $20/month (Pro) |
| Supabase | 500MB DB, 1GB storage | $0 | $25/month (Pro) |
| Cloudflare R2 | 10GB storage | $0 | $3-5/month |
| Razorpay | Transaction fees only | $0 | 2% per transaction |
| Resend | 3k emails/month | $0 | $20/month |
| Domain | - | $1/month | $1/month |
| Sentry | 5k events/month | $0 | $26/month |
| **TOTAL** | | **~$1/month** | **~$95/month** |

---

### 🚀 Phase 2: Scale Stack (Revenue > $500/month)

**Trigger Points:**
- Database > 400MB (upgrade Supabase to Pro: $25/month)
- Storage > 5GB (add Cloudflare R2)
- Email > 2500/month (upgrade Resend: $20/month)
- Need custom backend logic (add Railway: $5-20/month)

**Upgrades:**
- **Supabase Pro:** $25/month (8GB DB, 100GB storage, better performance)
- **Vercel Pro:** $20/month (unlimited bandwidth for commercial)
- **Custom Backend:** Railway/Render ($5-20/month)
- **Redis:** Upstash free tier → $10/month when needed

---

### 🏗️ Phase 3: Production Scale (Revenue > $2000/month)

**Trigger Points:**
- Need dedicated resources
- Compliance requirements (GDPR, data residency)
- High traffic (>100k visits/month)

**Migrations:**
- **Database:** Migrate to AWS RDS / DigitalOcean Managed PostgreSQL
- **Backend:** Dedicated servers (DigitalOcean, AWS, GCP)
- **Storage:** AWS S3 with CloudFront CDN
- **Caching:** Redis cluster
- **Load Balancing:** AWS ALB / Cloudflare Load Balancer

---

## Technical Debt & Migration Paths

### Current Technical Debt (Accepted for MVP)

1. **No Separate Backend**
   - **Debt:** Using Supabase Edge Functions + direct client calls
   - **Limitation:** Complex business logic harder to organize
   - **Migration Path:** Build NestJS/Express API later, gradually move logic
   - **When:** When edge functions >50 or complex workflows needed

2. **No Dedicated Cache Layer**
   - **Debt:** Using Supabase's built-in caching only
   - **Limitation:** Limited cache control
   - **Migration Path:** Add Upstash Redis when needed
   - **When:** Performance issues or need for queues/sessions

3. **Limited Image Processing**
   - **Debt:** Basic Supabase Storage transformations
   - **Limitation:** Limited format options, basic optimization
   - **Migration Path:** Add Cloudflare Images or Imgix
   - **When:** Image quality complaints or bandwidth costs spike

4. **No Background Jobs**
   - **Debt:** No job queue initially
   - **Limitation:** Long-running tasks must be synchronous
   - **Migration Path:** Add Bull/BullMQ with Redis
   - **When:** Need async email sending, bulk operations

5. **Basic Search**
   - **Debt:** PostgreSQL full-text search only
   - **Limitation:** Limited search features (no typo tolerance, ranking)
   - **Migration Path:** Add Algolia or Meilisearch
   - **When:** Users complain about search quality

6. **Manual Payouts**
   - **Debt:** Admin manually processes payouts
   - **Limitation:** Doesn't scale, slow for organizers
   - **Migration Path:** Integrate Razorpay Route/Transfer APIs
   - **When:** >10 payout requests per week

### Migration Strategy

```
MVP (Month 0-3)
└── Supabase + Next.js + Vercel
    └── Direct DB queries from frontend
    └── Supabase Auth
    └── Edge Functions for critical logic

Growth (Month 3-12)
└── Add custom backend API (NestJS)
    └── Gradually move business logic
    └── Keep Supabase for auth & storage
    └── Add Redis for caching

Scale (Month 12+)
└── Dedicated infrastructure
    └── Kubernetes or managed services
    └── Separate auth service
    └── Microservices (if needed)
```

---

## User Roles & Permissions

### Role Hierarchy
1. **Super Admin** - Full platform access
   - Manage all users, communities, events, content
   - Approve payouts
   - Configure system settings
   - Access all dashboards

2. **Community Admin** - Assigned by Super Admin
   - Manage their community's content
   - Create/edit community posts & events
   - Manage community members
   - Manage community game library
   - Configure community settings
   - Cannot access other communities

3. **Event Organizer** - Any registered user can become one
   - Create and manage their own events
   - Upload event photos
   - View attendee lists
   - Track earnings & request payouts
   - Cannot manage other users' events

4. **Registered User** - Default role after registration
   - Register for events
   - Participate in discussions
   - Create game collections
   - Log game sessions
   - Join communities
   - Comment and vote

5. **Guest** - Not logged in
   - View events, discussions, reviews
   - Cannot register for events or participate
   - Prompted to sign up for interactive features

### Permission Matrix

| Feature | Guest | User | Organizer | Community Admin | Super Admin |
|---------|-------|------|-----------|-----------------|-------------|
| View Events | ✓ | ✓ | ✓ | ✓ | ✓ |
| Register for Events | ✗ | ✓ | ✓ | ✓ | ✓ |
| Create Events | ✗ | ✗ | ✓ | ✓ | ✓ |
| View Discussions | ✓ | ✓ | ✓ | ✓ | ✓ |
| Post in Discussions | ✗ | ✓ | ✓ | ✓ | ✓ |
| Manage Community | ✗ | ✗ | ✗ | ✓ (own) | ✓ (all) |
| Approve Payouts | ✗ | ✗ | ✗ | ✗ | ✓ |
| Access Admin Panel | ✗ | ✗ | ✗ | ✗ | ✓ |

---

## Core Data Models

### Primary Entities

1. **Users**
   - id, email, password_hash, name, avatar
   - role (enum: user, organizer, community_admin, super_admin)
   - created_at, updated_at, last_login

2. **Communities**
   - id, name, slug, description, logo
   - admin_user_id (FK to Users)
   - settings (JSON: colors, features enabled)
   - min_payout_threshold (DECIMAL, minimum amount for organizer payouts)
   - platform_commission_rate (DECIMAL, percentage fee on ticket sales, e.g., 0.05 for 5%)
   - created_at, updated_at

3. **Events**
   - id, title, description, organizer_id (FK to Users)
   - community_id (FK to Communities, nullable)
   - location (city, venue, address)
   - start_date, end_date
   - ticket_price, max_attendees, registration_deadline
   - custom_fields (JSON, additional registration form fields organizer wants)
   - status (enum: draft, published, pending_approval, cancelled, completed, under_review)
   - moderation_status (enum: approved, pending, under_review, rejected)
   - moderation_flags (JSON array, e.g., ["url_detected", "profanity"])
   - admin_notes (TEXT, private notes for admin team)
   - flagged_at, reviewed_at, reviewed_by (FK to Users)
   - created_at, updated_at

4. **EventRegistrations**
   - id, event_id (FK), user_id (FK)
   - name, email, phone (captured at registration, may differ from user profile)
   - custom_responses (JSON, answers to organizer's custom fields)
   - ticket_count, total_amount
   - payment_status (enum: pending, completed, refunded, failed), payment_id
   - transaction_id (FK to Transactions, nullable for free events)
   - registered_at, checked_in_at

5. **Games**
   - id, name, description, publisher
   - min_players, max_players, play_time
   - complexity, year_published
   - image_url, bgg_link
   - created_at, updated_at

6. **GameCollections**
   - id, user_id (FK) or community_id (FK)
   - game_id (FK to Games)
   - status (enum: owned, want_to_buy, played)
   - notes

7. **PlayLogs**
   - id, game_id (FK), user_id (FK)
   - played_at, location
   - players (JSON array), scores (JSON array)
   - notes, photos
   - is_coop, result (win/loss for coop games)

8. **Discussions**
   - id, title, body, author_id (FK to Users)
   - category (enum: rules, strategy, general)
   - tags, views_count, votes_count
   - is_answered, best_answer_id
   - moderation_status (enum: approved, pending, under_review, rejected)
   - moderation_flags (JSON array, e.g., ["url_detected", "profanity"])
   - admin_notes (TEXT, private notes for admin team)
   - flagged_at, reviewed_at, reviewed_by (FK to Users)
   - created_at, updated_at

9. **Comments**
   - id, discussion_id (FK), parent_comment_id (FK, nullable)
   - author_id (FK to Users)
   - body, votes_count, is_best_answer
   - moderation_status (enum: approved, pending, under_review, rejected)
   - moderation_flags (JSON array, e.g., ["url_detected", "profanity"])
   - admin_notes (TEXT, private notes for admin team)
   - flagged_at, reviewed_at, reviewed_by (FK to Users)
   - created_at, updated_at

10. **Reviews**
    - id, game_id (FK), author_id (FK to Users)
    - title, body, rating (1-10)
    - pros, cons
    - created_at, updated_at

11. **ShopLinks**
    - id, game_id (FK)
    - retailer_name, url, affiliate_code
    - price (if available), is_active
    - created_at, updated_at

12. **Transactions**
    - id, user_id (FK), event_id (FK)
    - amount, platform_fee, organizer_amount
    - commission_rate_applied (DECIMAL, snapshot of rate used for this transaction)
    - payment_gateway, payment_id
    - payment_status (enum: pending, completed, refunded, failed)
    - refund_amount (DECIMAL, nullable)
    - refund_reason (TEXT, nullable)
    - refunded_at (TIMESTAMP, nullable)
    - refunded_by (FK to Users, admin who processed refund)
    - created_at, updated_at

13. **Payouts**
    - id, organizer_id (FK to Users)
    - amount, status (enum: requested, approved, processing, completed)
    - requested_at, approved_at, completed_at
    - bank_details (encrypted)

14. **Images**
    - id, uploader_id (FK to Users)
    - event_id (FK, nullable), play_log_id (FK, nullable)
    - url, thumbnail_url
    - tags (JSON), caption
    - uploaded_at

15. **ModerationSettings**
    - id, setting_key (UNIQUE, e.g., 'banned_words', 'allowed_urls')
    - setting_value (JSON, array of strings)
    - description (TEXT)
    - updated_at, updated_by (FK to Users)

**Purpose:** Store configurable moderation rules:
- `banned_words`: Array of profanity and inappropriate terms
- `banned_racial_terms`: Array of racial slurs
- `allowed_url_domains`: Whitelist of allowed domains (e.g., boardgamegeek.com)
- `auto_flag_threshold`: Number of flags before auto-hiding content

---

## Key Technical Considerations

### 1. Multi-Tenancy Architecture
- Communities are isolated with their own admins, content, and settings
- Shared database with `community_id` foreign keys
- Row-level security (if using Supabase) or application-level permissions

### 2. Payment Flow
```
User → Buys Ticket → Payment Gateway (Razorpay) → Success
  ↓
Platform calculates fee using event's community commission rate
  ↓
Transaction recorded: total_amount, platform_fee, organizer_amount, commission_rate_applied
  ↓
Organizer balance updated

When organizer_balance >= community.min_payout_threshold:
  Organizer → Request Payout → Admin Reviews → Approves → Payment Processed → Completed
```

**Example Calculation:**
- Ticket Price: ₹500
- Community Commission Rate: 5% (0.05) - **DEFAULT**
- Platform Fee: ₹25 (500 × 0.05)
- Organizer Receives: ₹475
- Min Payout Threshold: ₹500 INR - **DEFAULT**

**Commission Rate Changes (Historical Data Handling):**
- When community admin changes commission rate, it only applies to NEW transactions
- The `commission_rate_applied` field in transactions table captures the rate used at time of purchase
- Example scenario:
  - Jan 1: Community rate is 5%, ticket sold for ₹500 → transaction stores 0.05
  - Feb 1: Community changes rate to 10%
  - Feb 5: New ticket sold for ₹500 → transaction stores 0.10
  - Historical reports show accurate fees for each period
  - Organizer payout calculations use actual fees from transactions, not current rate

**Benefits:**
- Accurate historical financial reporting
- No retroactive changes to past earnings
- Audit trail for compliance
- Fair to organizers (locked rates at time of sale)

### 3. Image Storage Strategy
- Images uploaded to object storage (S3/R2)
- Generate thumbnails on upload (multiple sizes)
- Serve via CDN for performance
- Set storage quotas per organizer/community
- Implement lazy loading and WebP format

### 4. Scalability Considerations
- Use Redis for caching frequently accessed data
- Database indexing on frequently queried fields
- Pagination for all list views
- Background jobs for email sending, image processing
- CDN for static assets and images

### 5. Security
- JWT tokens with expiration
- HTTPS only
- Input validation and sanitization
- SQL injection prevention (ORM parameterized queries)
- XSS protection
- CSRF tokens for forms
- Rate limiting on API endpoints
- File upload validation (size, type)
- User-generated content moderation

### 6. Cost Optimization
- Use free tiers where possible (Vercel, Supabase free tier)
- Optimize image storage (compression, WebP)
- Efficient database queries
- CDN caching
- Lazy load images and components

### 7. Payment System Implementation Notes

**When processing a ticket purchase:**
```typescript
// 1. Get event's community to fetch current commission rate
const event = await supabase
  .from('events')
  .select('*, community:communities(*)')
  .eq('id', eventId)
  .single()

// 2. Calculate fees using community's current rate
const ticketPrice = event.ticket_price
const commissionRate = event.community.platform_commission_rate // e.g., 0.05
const platformFee = ticketPrice * commissionRate
const organizerAmount = ticketPrice - platformFee

// 3. Create transaction record with rate snapshot
await supabase.from('transactions').insert({
  user_id: userId,
  event_id: eventId,
  amount: ticketPrice,
  platform_fee: platformFee,
  organizer_amount: organizerAmount,
  commission_rate_applied: commissionRate,  // IMPORTANT: Snapshot current rate
  payment_gateway: 'razorpay',
  payment_id: razorpayPaymentId,
  payment_status: 'completed'
})
```

**When community admin changes commission rate:**
- Update `communities.platform_commission_rate` only
- Do NOT update existing transactions
- Future transactions will automatically use new rate
- Historical reporting queries use `commission_rate_applied` from transactions table

**Payout eligibility check:**
```typescript
// Sum organizer's earnings from all their events
const { data: totalEarnings } = await supabase
  .from('transactions')
  .select('organizer_amount')
  .eq('event_id', 'IN', organizerEventIds)
  .eq('payment_status', 'completed')

const balance = totalEarnings.reduce((sum, t) => sum + t.organizer_amount, 0)

// Check against community's min threshold
const canRequestPayout = balance >= community.min_payout_threshold
```

**Key Principles:**
- Always use `commission_rate_applied` for calculations on existing transactions
- Never recalculate fees based on current community rate for past transactions
- Payout calculations sum actual `organizer_amount` from transactions, not recalculated values
- Rate changes are forward-looking only

### 8. Content Moderation Implementation Notes

**Automated Content Screening (on submit):**
```typescript
async function moderateContent(content: string, contentType: 'event' | 'discussion' | 'comment') {
  const flags: string[] = []

  // 1. URL Detection
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const urls = content.match(urlRegex) || []

  if (urls.length > 0) {
    // Check against allowed domains whitelist
    const { data: allowedDomains } = await supabase
      .from('moderation_settings')
      .select('setting_value')
      .eq('setting_key', 'allowed_url_domains')
      .single()

    const hasDisallowedUrl = urls.some(url => {
      const domain = new URL(url).hostname
      return !allowedDomains.setting_value.includes(domain)
    })

    if (hasDisallowedUrl) flags.push('url_detected')
  }

  // 2. Script/Code Detection
  const dangerousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,  // onclick=, onload=, etc.
    /<iframe/gi,
    /eval\(/gi,
  ]

  if (dangerousPatterns.some(pattern => pattern.test(content))) {
    flags.push('script_detected')
  }

  // 3. Profanity & Racial Slurs Check
  const { data: bannedWords } = await supabase
    .from('moderation_settings')
    .select('setting_value')
    .eq('setting_key', 'banned_words')
    .single()

  const { data: racialTerms } = await supabase
    .from('moderation_settings')
    .select('setting_value')
    .eq('setting_key', 'banned_racial_terms')
    .single()

  const lowerContent = content.toLowerCase()

  if (bannedWords.setting_value.some(word => lowerContent.includes(word.toLowerCase()))) {
    flags.push('profanity')
  }

  if (racialTerms.setting_value.some(term => lowerContent.includes(term.toLowerCase()))) {
    flags.push('racial_slur')
  }

  // 4. Determine moderation status
  let moderationStatus = 'approved'

  if (flags.includes('script_detected')) {
    // Auto-reject scripts
    moderationStatus = 'rejected'
  } else if (flags.includes('racial_slur') || flags.includes('profanity')) {
    // Auto flag for review
    moderationStatus = 'under_review'
  } else if (flags.includes('url_detected')) {
    // Flag for review but don't auto-hide
    moderationStatus = 'under_review'
  }

  return {
    moderationStatus,
    moderationFlags: flags,
    flaggedAt: flags.length > 0 ? new Date() : null
  }
}
```

**Event Registration Flows:**

```typescript
// FREE EVENT FLOW
async function registerForFreeEvent(eventId, userData) {
  // 1. Collect user data (auto-fill from profile + past registrations)
  const prefillData = {
    name: user.profile.name || userData.name,
    email: user.profile.email || userData.email,
    phone: user.profile.phone || (await getLastUsedPhone(user.id)),
    ...userData.customResponses
  }

  // 2. Create registration record
  const registration = await supabase.from('event_registrations').insert({
    event_id: eventId,
    user_id: user.id,
    name: prefillData.name,
    email: prefillData.email,
    phone: prefillData.phone,
    custom_responses: userData.customResponses,
    ticket_count: 1,
    total_amount: 0,
    payment_status: 'completed',  // No payment needed
    registered_at: new Date()
  })

  // 3. Generate ticket with QR code
  const ticket = await generateTicket(registration)

  // 4. Send confirmation email
  await sendTicketEmail(user.email, ticket)

  // 5. Redirect to confirmation page
  return { success: true, ticketId: ticket.id }
}

// PAID EVENT FLOW
async function registerForPaidEvent(eventId, userData) {
  // 1. Collect user data (same as free event)
  const prefillData = { /* same as above */ }

  // 2. Create pending registration
  const registration = await supabase.from('event_registrations').insert({
    event_id: eventId,
    user_id: user.id,
    name: prefillData.name,
    email: prefillData.email,
    phone: prefillData.phone,
    custom_responses: userData.customResponses,
    ticket_count: 1,
    total_amount: event.ticket_price,
    payment_status: 'pending',
    registered_at: new Date()
  })

  // 3. Create Razorpay order
  const order = await razorpay.orders.create({
    amount: event.ticket_price * 100,  // Razorpay uses paise
    currency: 'INR',
    receipt: `reg_${registration.id}`
  })

  // 4. Redirect to payment page
  return {
    success: true,
    registrationId: registration.id,
    razorpayOrderId: order.id,
    amount: event.ticket_price
  }
}

// PAYMENT COMPLETION CALLBACK
async function handlePaymentSuccess(razorpayPaymentId, registrationId) {
  const registration = await supabase
    .from('event_registrations')
    .select('*, event:events(*, community:communities(*))')
    .eq('id', registrationId)
    .single()

  // 1. Calculate fees
  const commissionRate = registration.event.community.platform_commission_rate
  const platformFee = registration.total_amount * commissionRate
  const organizerAmount = registration.total_amount - platformFee

  // 2. Create transaction record
  const transaction = await supabase.from('transactions').insert({
    user_id: registration.user_id,
    event_id: registration.event_id,
    amount: registration.total_amount,
    platform_fee: platformFee,
    organizer_amount: organizerAmount,
    commission_rate_applied: commissionRate,
    payment_gateway: 'razorpay',
    payment_id: razorpayPaymentId,
    payment_status: 'completed'
  })

  // 3. Update registration status
  await supabase.from('event_registrations').update({
    payment_status: 'completed',
    transaction_id: transaction.id
  }).eq('id', registrationId)

  // 4. Generate ticket
  const ticket = await generateTicket(registration)

  // 5. Send confirmation email with receipt
  await sendTicketEmail(registration.email, ticket, transaction)

  // 6. Redirect to confirmation page
  return { success: true, ticketId: ticket.id }
}
```

**Admin Moderation Dashboard:**
- Query all content with `moderation_status = 'under_review'`
- Display flagged content with moderation_flags highlighted
- Admin actions: Approve, Reject, Add Notes
- On approve: Set `moderation_status = 'approved'`, `reviewed_at = NOW()`, `reviewed_by = admin_id`
- On reject: Set `moderation_status = 'rejected'` or delete content
- Notify content author of decision

**Paid Event Approval Workflow:**
- When organizer creates paid event, set `status = 'pending_approval'`
- Notify admin of new paid event
- Admin reviews event details
- Admin approves: Set `status = 'published'`
- Admin rejects: Set `status = 'draft'`, add rejection reason in admin_notes
- Only published events appear in public listings

---

## Change Log

### 2026-01-22 (Continued - Phase 3 Progress)

#### Event Management System Implementation
- **Bug Fixes:**
  - Fixed searchParams async issue in events page (Next.js 15+ requires Promise type)
  - Added email verification error messaging to login page
  - Added success/error messaging to signup page
  - Converted auth pages to client components with useFormState pattern
- **Tiptap Rich Text Editor:**
  - Installed Tiptap packages for WYSIWYG editing
  - Created reusable RichTextEditor component with formatting toolbar
  - Integrated Tailwind Typography plugin for prose styling
- **Event Detail Page:**
  - Created dynamic route for event details (`/events/[id]`)
  - Shows full event info, organizer, venue, pricing, capacity
  - Registration status checking (already registered, full, available)
  - RegisterButton component for handling registrations
- **Event Creation Form:**
  - Protected route requiring authentication
  - Rich text editor for event descriptions
  - Date/time inputs for event scheduling
  - Location fields (venue name, address, city)
  - Capacity and pricing configuration
  - Events submitted to moderation queue (status: draft, moderation_status: pending)
- **Server Actions:**
  - createEvent: Validates and creates events with moderation workflow
  - registerForEvent: Handles free/paid event registrations
  - Validation for dates, capacity, required fields
- **Files Created:**
  - `components/RichTextEditor.tsx`
  - `app/events/[id]/page.tsx`
  - `app/events/[id]/RegisterButton.tsx`
  - `app/events/create/page.tsx`
  - `app/events/create/EventForm.tsx`
  - `lib/actions/events.ts`
- **Next Steps:**
  - Test event creation and registration flows
  - Build admin moderation dashboard
  - Integrate payment gateway for paid events
  - Build organizer dashboard for event management

### 2026-01-22

#### Initial Planning
- Project initialized
- Created basic directory structure (frontend/, backend/)
- Created CLAUDE.md for AI assistance
- Created plan.md for project tracking

#### Scope Evolution
- **Initial Vision:** Editorial-style board game magazine website
- **Revised Vision:** Comprehensive community platform with multiple features
- Expanded scope to include:
  - Event management & ticketing (like Meetup + Eventbrite)
  - Community discussions (Stack Overflow style)
  - Game collections & play logs (BoardGameGeek style)
  - Shopping directory with affiliate links
  - Multi-tenant community management
  - Payment processing & organizer payouts
  - Photo galleries with event organizer uploads
  - Central admin dashboard

#### Documentation
- Documented 12 development phases:
  1. Foundation & Infrastructure
  2. User Management & Auth
  3. Event Management System
  4. Community Discussion Platform
  5. Game Collections & Play Logs
  6. Shopping Directory & Affiliates
  7. Reviews, Comparisons & Guides
  8. Photo Gallery System
  9. Multi-Tenant Community Management
  10. Payment & Payout System
  11. Admin Dashboard
  12. Enhancement & Optimization
- Defined platform structure with 5 main sections (Public, User Dashboard, Organizer Dashboard, Community Admin, Super Admin)
- Recommended technology stack documented
- Key technical considerations outlined (multi-tenancy, payments, image storage, scalability, security, cost optimization)

#### Tech Stack Finalization
- **Finalized cost-optimized stack** prioritizing $0-5/month budget:
  - Supabase Free Tier (database, auth, storage, edge functions)
  - Vercel Free Tier (frontend hosting)
  - Cloudflare R2 (overflow storage when needed)
  - Razorpay (payment gateway, transaction fees only)
  - Resend (email, 3k free/month)
- **Documented 6 technical debt items** with clear migration paths
- **Created 3-phase scaling strategy**: MVP ($1/month) → Growth ($95/month) → Production Scale
- **Cost breakdown table** showing free tier limits and upgrade paths

#### Business Logic Decisions
- **Platform commission & payout thresholds are per-community** (not global):
  - Added `min_payout_threshold` field to communities table (default: ₹500 INR)
  - Added `platform_commission_rate` field to communities table (default: 5% / 0.05)
  - Added `commission_rate_applied` to transactions table (audit trail)
  - Commission rate changes apply to NEW transactions only (preserves historical data)
  - Enables flexible business arrangements with different communities
  - Documented detailed payment flow with example calculation and rate change scenarios
- **Finalized defaults:**
  - Default platform commission: 5%
  - Default minimum payout: ₹500 INR
  - Rate changes: Apply to new transactions only (historical transactions unchanged)
- **Refund policy:** Manual refunds only (no automation in MVP)
  - Admin processes refund via Razorpay portal manually
  - Admin marks transaction as `refunded` with reason in system
  - Transactions table tracks refund_amount, refund_reason, refunded_at, refunded_by
- **Free vs Paid Events:** Same flow with different payment steps
  - Free events: Form → Confirmation → Ticket
  - Paid events: Form → Payment → Confirmation → Ticket
  - Both generate digital tickets with QR codes
  - Event registration form supports custom fields defined by organizer
  - Auto-fill from user profile and past registrations
- **Community approval:** Auto-approved with grace period
  - Communities go live immediately with warning message
  - Paid events require manual admin approval before publishing
  - Free events publish immediately
  - Admin can deactivate communities or events anytime
- **Content moderation:** Basic automated screening
  - URL detection with whitelist
  - Script/code snippet detection and blocking
  - Profanity and racial slurs via dictionary lookup
  - Flagged content goes to admin review queue
  - Admin can approve, reject, or add private notes
  - Added moderation_status, moderation_flags, admin_notes fields to events, discussions, comments
  - Created ModerationSettings table for configurable rules

#### Development Progress
- **Phase 1: Foundation** ✅ COMPLETED
  - Next.js 14 with TypeScript and Tailwind CSS v4 configured
  - Supabase project created and connected
  - 7 core database tables created with RLS policies
  - Development environment running at localhost:3000
  - Environment variables configured
  - Test page created to verify database connection

- **Phase 2: User Management & Authentication** ✅ COMPLETED
  - Server actions created for login, signup, logout
  - Login page (`/login`) with email/password authentication
  - Signup page (`/signup`) with automatic profile creation
  - User dashboard (`/dashboard`) with protected routes
  - Homepage updated with dynamic auth buttons
  - Session management via Supabase Auth + middleware
  - Auto-profile creation trigger working
  - Files created:
    - `lib/actions/auth.ts` - Authentication server actions
    - `app/(auth)/login/page.tsx` - Login page
    - `app/(auth)/signup/page.tsx` - Signup page
    - `app/dashboard/page.tsx` - User dashboard
    - Updated `app/page.tsx` - Homepage with auth links

- **Phase 3: Event Management System** 🔄 IN PROGRESS
  - Bug fixes:
    - Fixed searchParams async issue in events listing page (Next.js 15+ compatibility)
    - Added email verification messaging to login/signup pages
    - Converted auth pages to client components with useFormState
  - Rich text editor integration:
    - Installed Tiptap (@tiptap/react, @tiptap/starter-kit)
    - Installed Tailwind Typography plugin (@tailwindcss/typography)
    - Created reusable RichTextEditor component with toolbar (bold, italic, headings, lists, quotes)
  - Event detail page (`/events/[id]/page.tsx`):
    - Full event information display
    - Organizer details and community info
    - Registration status checking
    - Attendee count and capacity tracking
    - RegisterButton component for handling registrations
  - Event creation form (`/events/create/page.tsx`):
    - Protected route (requires authentication)
    - Rich text editor for event descriptions
    - Date/time pickers for start and end dates
    - Location fields (name, address, city)
    - Capacity and pricing inputs
    - Moderation workflow (events start as 'draft' with 'pending' moderation status)
  - Server actions (`lib/actions/events.ts`):
    - createEvent: Creates new event with validation and moderation queue
    - registerForEvent: Handles free event registrations and paid event pending registrations
    - Event validation (dates, capacity, required fields)
  - Files created:
    - `components/RichTextEditor.tsx` - Reusable Tiptap editor
    - `app/events/[id]/page.tsx` - Event detail page
    - `app/events/[id]/RegisterButton.tsx` - Registration handler
    - `app/events/create/page.tsx` - Event creation page wrapper
    - `app/events/create/EventForm.tsx` - Event creation form with Tiptap
    - `lib/actions/events.ts` - Event server actions

---

## Open Questions & Decisions Needed

### ✅ Technical Decisions (FINALIZED)
- [x] **Architecture:** Start with Supabase + Next.js (no separate backend initially)
- [x] **Monorepo:** Single Next.js repo initially, split later if needed
- [x] **Database:** Supabase (PostgreSQL) with Row Level Security
- [x] **Payment Gateway:** Razorpay (India-focused, transaction fees only)
- [x] **Image Storage:** Supabase Storage (1GB free) → Cloudflare R2 when scaling
- [x] **Hosting:** Vercel (frontend) + Supabase (backend/DB)
- [x] **Email Service:** Resend (3k emails/month free)
- [x] **Cost Strategy:** Start at ~$1/month, scale to $95/month only when revenue justifies

### ⏳ Technical Decisions (Still Needed)

### Business Logic (Decided)
- [x] **Platform commission & payout threshold:** Configurable per community (stored in communities table)
  - Each community can set their own `platform_commission_rate` (e.g., 5%, 10%)
  - Each community can set their own `min_payout_threshold` (e.g., ₹500, ₹1000)
  - Allows flexibility for different community arrangements
  - Super admin sets defaults for new communities

### Business Logic (Finalized - Additional)
- [x] **Default commission rate:** 5% (0.05) for new communities
- [x] **Default minimum payout threshold:** ₹500 INR
- [x] **Commission rate changes:** Apply to new transactions only
  - Historical data preserved via `commission_rate_applied` field in transactions table
  - When community admin changes commission rate, only future ticket sales use new rate
  - Past transactions remain unchanged (audit trail maintained)

- [x] **Refund Policy:**
  - **No automated refunds** in MVP
  - Manual refund process only:
    1. User reports issue to admin
    2. Admin reviews case
    3. Admin initiates refund via Razorpay payment portal manually
    4. Admin marks transaction as `refunded` in system with refund details
  - Transaction status: `completed`, `refunded`, `failed`
  - Refunded transactions tracked for reporting and organizer earnings adjustments

- [x] **Free vs Paid Events:**
  - **Same registration flow until payment step**
  - **Free Events (ticket_price = 0):**
    - Collect registration form (name, phone, email + custom fields from organizer)
    - Auto-fill some fields from user login data + past registration history
    - Direct to ticket confirmation page (no payment step)
    - Generate ticket with QR code
  - **Paid Events (ticket_price > 0):**
    - Collect registration form (same fields as free events)
    - Redirect to payment page (Razorpay integration)
    - Complete payment
    - On success: Redirect to ticket confirmation page
    - Generate ticket with QR code and payment receipt
  - Both types generate digital tickets with event details

- [x] **Community Approval Process:**
  - **Auto-approved with grace period warning**
  - Upon community creation:
    - Status set to `active` immediately
    - Automated message sent to community admin:
      > "Your community has been created and is in a grace period. Any unwanted activity will result in immediate removal or deactivation. Please ensure your community follows our guidelines."
  - **Paid Events Require Manual Review:**
    - Free events: Published immediately (with grace period warning)
    - Paid events: Status set to `pending_approval`
    - Admin/Sub-admin must review and approve before event goes live
    - Notification sent to admin when new paid event is created
  - Admin can deactivate communities or put events on hold at any time

- [x] **User-Generated Content Moderation:**
  - **Basic automated moderation for events, posts, comments:**
    - **URL Detection:** Flag content containing URLs for review
    - **Script Detection:** Detect and block `<script>`, `javascript:`, `onclick=`, etc.
    - **Swear Words & Racial Slurs:** Dictionary-based detection (configurable list)
    - **Suspicious Activity Triggers:**
      - Multiple URLs in short time
      - Script tags or code snippets
      - Flagged keywords from dictionary
  - **Moderation Workflow:**
    1. Content flagged by automated system
    2. Content status set to `under_review`
    3. Admin notified with flagged content details
    4. Admin can:
       - Approve (publish content)
       - Put in `draft` (hide from public)
       - Delete permanently
       - Add private admin notes/comments
    5. User notified if content is rejected
  - **Admin Tools:**
    - View all flagged content in moderation queue
    - Filter by type (event, post, comment)
    - Add private admin notes on each item
    - Quick approve/reject actions
    - Ban users for repeat violations
  - **Content Fields:**
    - `moderation_status`: `approved`, `pending`, `under_review`, `rejected`
    - `moderation_flags`: JSON array of detected issues (e.g., `["url_detected", "profanity"]`)
    - `admin_notes`: Private notes for admin team
    - `flagged_at`, `reviewed_at`, `reviewed_by`

### Business Logic (Still Needed)
- [ ] Specific swear words & racial slurs dictionary (to be curated)
- [ ] URL whitelist (e.g., allow boardgamegeek.com, official rulebooks)
- [ ] How many flags before user is auto-banned?

### Features
- [ ] Allow organizers to become event organizers automatically or require approval?
- [ ] Should users be able to rate/review events after attending?
- [ ] Real-time notifications or email-only?
- [ ] Social login (Google/Facebook) or email-only?
- [ ] Allow anonymous posting in discussions?

---

## Notes & Decisions

### Architecture Decisions
- **2026-01-22:** Decided on multi-tenant architecture with shared database (community_id foreign keys)
- **2026-01-22:** Decided on role-based access control with 5 user roles
- **2026-01-22:** Finalized cost-optimized stack:
  - Supabase as all-in-one backend (PostgreSQL + Auth + Storage + Edge Functions)
  - Next.js on Vercel for frontend
  - No separate backend API initially (accepted technical debt)
  - Direct DB access from frontend with Row Level Security
  - Razorpay for payments (India-focused)
  - Resend for emails (3k free/month)
  - Target: ~$1/month to start, scale to $95/month when revenue justifies
- **2026-01-22:** Defined clear migration paths for each technical debt item
- **2026-01-22:** Payment & payout settings are per-community (not global):
  - Platform commission rate configurable per community (default: 5%)
  - Minimum payout threshold configurable per community (default: ₹500 INR)
  - Commission rate changes apply to NEW transactions only (historical data preserved)
  - Transactions table stores `commission_rate_applied` for audit trail
  - Enables flexible business arrangements with different communities
  - Super admin sets defaults for new communities
- **2026-01-22:** Refund, event flow, approval & moderation policies:
  - Manual refund process only (no automation in MVP)
  - Free and paid events use same registration flow (differ at payment step)
  - Event registration forms support custom fields from organizer
  - Communities auto-approved with grace period warning
  - Paid events require manual admin approval before publishing
  - Content moderation: URL detection, script blocking, profanity/racial slurs dictionary
  - Moderation workflow with admin review queue and private notes
  - Added ModerationSettings table for configurable rules
  - Updated data models: Events, Discussions, Comments with moderation fields
  - Updated EventRegistrations and Transactions with refund tracking

### Technical Debt
- None yet

### Known Issues
- None yet

### Risks & Mitigation
- **Risk:** Payment processing complexity → **Mitigation:** Use well-tested SDKs (Razorpay/Stripe)
- **Risk:** Image storage costs → **Mitigation:** Implement quotas, compression, and CDN caching
- **Risk:** Spam/abuse in discussions → **Mitigation:** Implement moderation tools and rate limiting
- **Risk:** Organizer payout fraud → **Mitigation:** Manual approval initially, KYC verification later

---

## Resources

### Documentation
- [Link to documentation]

### Design Assets
- [Link to designs/wireframes]

### References
- [Useful links and references]
