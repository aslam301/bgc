# BoardGameCulture - Project Summary

**Last Updated**: 2026-01-22
**Status**: MVP Core Features Complete
**Version**: 1.0.0 (Development)

---

## 🎯 Project Overview

BoardGameCulture is a comprehensive community platform for board gamers in India, combining:
- **Event Management** (city-wise board game events)
- **Community Discussions** (rules, strategy, general)
- **Shopping Directory** (where to buy in India)
- **Reviews & Guides** (game reviews, comparisons)
- **Game Collections** (personal & community lists with play logs)

**Target Audience**: Indian board game enthusiasts, event organizers, communities
**Business Model**: Platform commission on paid event tickets + affiliate shopping links

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15+ (App Router, Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Luma-inspired design system
- **UI Components**: Custom components + shadcn/ui
- **Rich Text**: Tiptap editor for event descriptions
- **Hosting**: Vercel (auto-deployment)

### Backend
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth (email + JWT)
- **Storage**: Supabase Storage (images, documents)
- **API**: Server Actions + Supabase Client/Server
- **Authorization**: Row Level Security (RLS) policies

### Design System
- **Colors**: Stone palette (#stone-50 to #stone-900), Golden-brown brand (#a89925)
- **Backgrounds**: Off-white (#fcfcfa), Warm gray (#f5f5f4)
- **Typography**: Inter font, medium/semibold/bold weights
- **Borders**: Rounded-xl (0.75rem), Rounded-2xl (1rem)
- **Effects**: Backdrop blur, subtle shadows, smooth transitions
- **Logo**: Circular board game badge (golden/black colors)

---

## ✅ Completed Features

### Phase 1: Foundation
✅ Next.js 15+ project setup with TypeScript
✅ Supabase integration (DB + Auth + Storage)
✅ Database schema design & migrations
✅ Luma-inspired design system
✅ Logo integration (BoardGameCulture badge)
✅ Mobile-responsive layouts
✅ Environment setup & CI/CD (Vercel)

### Phase 2: Authentication
✅ User registration with email
✅ Login/logout functionality
✅ Password reset flow (forgot password + reset pages)
✅ Protected routes with middleware
✅ User profiles (auto-created via trigger)
✅ Role-based access control (user, organizer, admin)
✅ User dashboard with stats
✅ Navigation with user menu dropdown

### Phase 3: Event Management
✅ Event listing page (4-column responsive grid)
✅ Event detail pages with images
✅ Event creation form (rich text editor)
✅ City-based filtering (dropdown selection)
✅ Ticket pricing & attendee limits
✅ Event moderation workflow (pending → approved/rejected)
✅ Organizer dashboard (My Events page)
✅ Attendee management (per event + all attendees view)
✅ Event edit functionality
✅ Registration flow (free & paid events)
✅ Unsplash board game images on event cards

### Phase 11: Admin Dashboard
✅ Admin overview with platform statistics
✅ Event monitoring & moderation interface
✅ Event approval/rejection workflow with admin notes
✅ Role-based access (super_admin only)
✅ Recent events list with status badges
✅ Quick actions for pending events

### UI/UX Enhancements
✅ Professional Luma-inspired design
✅ Consistent stone color palette
✅ Golden-brown brand accents
✅ Backdrop blur on navigation
✅ Proper hover states & transitions
✅ Mobile-optimized form padding
✅ Responsive grids (1-2-3-4 columns)
✅ Loading spinner with logo animation
✅ Board game-themed loading texts

---

## 🔄 In Progress / Deferred

### Event Management
⏸️ Event search & advanced filters (date, game type)
⏸️ Calendar view for events
⏸️ Map integration for event locations
⏸️ Event cancellation workflow
⏸️ Attendee check-in system with QR codes

### Future Phases (Not Started)
⏸️ **Phase 4**: Community Discussion Platform
⏸️ **Phase 5**: Game Collections & Play Logs
⏸️ **Phase 6**: Shopping Directory & Affiliate System
⏸️ **Phase 7**: Reviews, Comparisons & Guides
⏸️ **Phase 8**: Photo Gallery System
⏸️ **Phase 9**: Multi-Tenant Community Management
⏸️ **Phase 10**: Payment & Payout System (Razorpay)

---

## 📂 Project Structure

```
boardgameculture/
├── app/
│   ├── (auth)/              # Auth pages (login, signup, password reset)
│   ├── admin/               # Admin dashboard & moderation
│   ├── dashboard/           # User dashboard
│   ├── events/              # Event listing, detail, creation
│   ├── organizer/           # Organizer dashboard & tools
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/
│   ├── EventCard.tsx        # Event card component (grid/list)
│   ├── LoadingSpinner.tsx   # Loading animation with logo
│   ├── Navigation.tsx       # Global navigation
│   └── UserMenu.tsx         # User dropdown menu
├── lib/
│   ├── actions/             # Server actions (auth, events)
│   ├── supabase/            # Supabase clients (client.ts, server.ts)
│   └── utils.ts             # Utility functions
├── public/
│   └── logo.png             # BoardGameCulture logo
├── supabase/
│   └── migrations/          # Database migrations
├── CLAUDE.md                # Claude Code guidance
├── SETUP.md                 # Setup instructions
├── plan.md                  # Detailed project plan & roadmap
├── SUMMARY.md               # This file
└── .env.local               # Environment variables (not in git)
```

---

## 🗄️ Database Schema

### Core Tables
- **profiles** - User profiles (extends auth.users)
  - id (uuid, FK to auth.users)
  - name, email, role (user/organizer/super_admin)

- **events** - Event listings
  - title, description, start_date, end_date
  - location_city, location_venue, location_address
  - ticket_price, max_attendees
  - status (draft/published/cancelled)
  - moderation_status (pending/approved/rejected)
  - admin_notes (rejection reasons)

- **event_registrations** - User registrations
  - user_id, event_id
  - status (pending_payment/confirmed)
  - registered_at

- **cities** - City master data for dropdown
  - name, state, is_active, display_order

### Future Tables (Schema Defined)
- communities, games, discussions, comments, play_logs, transactions, payouts, etc.

---

## 🔐 Authentication & Authorization

### Supabase Auth
- Email/password authentication
- JWT tokens for session management
- Password reset with magic links
- Middleware refreshes session on every request

### Role-Based Access Control
- **Guest** - View public events only
- **User** - Register for events, view dashboard
- **Organizer** - Create/manage events, view attendees
- **Super Admin** - Full platform access, event moderation

### Row Level Security (RLS)
- Users can only see their own data
- Organizers can only edit their own events
- Admins can see all data
- Policies enforce permissions at DB level

---

## 🚀 Deployment

### Development
```bash
npm run dev        # Start dev server (localhost:3000)
npm run build      # Build for production
npm run lint       # Run ESLint
```

### Production (Vercel)
- Automatic deployments on git push
- Environment variables configured in Vercel dashboard
- Supabase connection strings
- Domain: TBD

---

## 📊 Current Statistics

### Platform Metrics
- **Total Routes**: 17
- **Pages Completed**: 15+
- **Components**: 10+
- **Database Tables**: 6 (with 10+ defined for future)
- **Build Time**: ~10 seconds
- **Build Status**: ✅ Successful

### Code Quality
- **TypeScript**: 100% coverage
- **ESLint**: Clean (no errors)
- **Mobile Responsive**: All major pages
- **Loading States**: Implemented
- **Error Handling**: Basic implementation

---

## 🐛 Known Issues & Fixes

### Recent Fixes (2026-01-22)
1. ✅ Dashboard banner color contrast (white text on white bg)
   → Changed to stone-800/900/black gradient

2. ✅ UserMenu dropdown z-index overlap with navigation
   → Added z-[60] to dropdown menu

3. ✅ Mobile form padding too large
   → Reduced from p-6 to p-5 on mobile

4. ✅ Password reset redirect not working
   → Added NEXT_PUBLIC_SITE_URL environment variable

5. ✅ Navigation sticky causing UX issues
   → Removed sticky positioning

### Current Known Issues
- None reported

---

## 🎯 Next Steps

### Immediate (Phase 10 - Payments)
1. **Razorpay Integration**
   - Set up Razorpay account
   - Integrate payment gateway
   - Implement order flow
   - Add transaction tracking

2. **Email Notifications**
   - Registration confirmations
   - Payment receipts
   - Event reminders
   - Admin moderation alerts

3. **Digital Tickets**
   - Generate QR codes
   - Email ticket delivery
   - Check-in system

### Short Term (Next 2-4 Weeks)
1. **Event Search & Filters**
   - Full-text search
   - Date range filters
   - Game type categories
   - Price filters

2. **Community Discussion Forum**
   - Discussion categories
   - Post creation
   - Threaded comments
   - Voting system

3. **SEO Optimization**
   - Meta tags
   - Open Graph
   - Sitemap
   - Structured data

### Long Term (Next 2-3 Months)
1. **Multi-Tenant Communities**
2. **Game Collections & Play Logs**
3. **Shopping Directory**
4. **Reviews & Guides**
5. **Photo Galleries**

---

## 💰 Cost Structure

### Current (Bootstrap Mode)
- **Hosting**: $0 (Vercel free tier)
- **Database**: $0 (Supabase free tier - 500MB DB, 1GB storage)
- **Domain**: ~$1/month
- **Total**: ~$1/month

### When Scaling (Revenue Mode)
- **Supabase Pro**: $25/month (8GB DB, 100GB storage)
- **Vercel Pro**: $20/month (better limits)
- **Razorpay**: 2% per transaction
- **Resend**: $20/month (50k emails)
- **Monitoring**: $10/month (Sentry)
- **Total**: ~$95/month

### Revenue Model
- Platform commission: 5% of paid event tickets (configurable per community)
- Affiliate commissions: TBD (shopping links)
- Premium community features: TBD

---

## 🤝 Contributing

This is currently a personal project. Contributions welcome once MVP is launched.

### Development Guidelines
- Follow existing code structure
- Use TypeScript strictly
- Write server actions for mutations
- Implement RLS policies for new tables
- Test on mobile devices
- Update documentation

---

## 📝 License

Proprietary - All rights reserved

---

## 📞 Contact

**Project Owner**: TBD
**Support**: TBD
**Website**: TBD

---

**For detailed technical documentation, see CLAUDE.md**
**For setup instructions, see SETUP.md**
**For full project roadmap, see plan.md**
