# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**BoardGameCulture** is a comprehensive community platform for board gamers in India, combining event management, discussions, game collections, and shopping guides. Built with a cost-optimized stack for hobby/bootstrap mode with clear paths to scale.

**See `plan.md` for full project vision, features, and roadmap.**
**See `SETUP.md` for detailed setup instructions.**

## Tech Stack

### Frontend
- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Hosting:** Vercel (free tier)

### Backend & Database
- **All-in-One:** Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **No separate backend API initially** (accepted technical debt)
- **Authentication:** Supabase Auth (email + OAuth)
- **Storage:** Supabase Storage (1GB free) → Cloudflare R2 for overflow

### Integrations
- **Payments:** Razorpay (India-focused)
- **Email:** Resend (3k emails/month free)
- **Monitoring:** Sentry free tier

### Cost Strategy
- **Current:** ~$1/month (domain only)
- **Growth:** ~$95/month when revenue justifies (Supabase Pro + Vercel Pro + Resend)
- **Scale:** Move to dedicated infrastructure when needed

## Development Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database (Supabase CLI)
npx supabase login       # Login to Supabase
npx supabase db push     # Push schema changes
npx supabase db pull     # Pull schema from remote
npx supabase gen types typescript --project-id <id> > types/database.ts

# Components (shadcn/ui)
npx shadcn@latest add <component-name>  # Add UI components
```

## Repository Structure

```
boardgameculture/
├── app/
│   ├── (auth)/          # Auth pages (login, signup)
│   ├── (dashboard)/     # User & organizer dashboards
│   ├── (public)/        # Public pages (events, discussions)
│   ├── admin/           # Admin dashboard
│   ├── api/             # API routes
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              # shadcn components
│   ├── auth/            # Auth-related components
│   ├── events/          # Event components
│   └── layout/          # Layout components
├── lib/
│   ├── supabase/        # Supabase clients (client.ts, server.ts)
│   ├── utils.ts         # Utility functions
│   └── validations/     # Zod schemas
├── types/
│   └── database.ts      # TypeScript types from Supabase
├── middleware.ts        # Auth middleware
├── plan.md              # Project plan & roadmap
├── SETUP.md             # Setup instructions
└── .env.local           # Environment variables (not in git)
```

## Architecture Notes

### Authentication Flow
- Supabase Auth handles user management
- `middleware.ts` refreshes sessions on every request
- Use `lib/supabase/client.ts` in Client Components
- Use `lib/supabase/server.ts` in Server Components/Actions

### Database Access
- **Direct client access** from frontend initially (with Row Level Security)
- Use Supabase RLS policies for authorization
- Complex logic in Edge Functions when needed
- **Migration path:** Build separate NestJS API later when Edge Functions become limiting

### File Uploads
- Upload to Supabase Storage buckets
- Public bucket for event images, avatars
- Private bucket for sensitive documents
- Generate thumbnails using Supabase Image Transformations

### Payments (Future)
- Razorpay integration for event ticket purchases
- Platform fee deducted on each transaction
- Organizer payout requests reviewed by admin
- Manual payouts initially → automated later

### User Roles & Permissions
1. **Super Admin** - Full platform access
2. **Community Admin** - Manage assigned community
3. **Event Organizer** - Create/manage own events
4. **Registered User** - Participate, register for events
5. **Guest** - View-only access

Permissions enforced via Supabase RLS policies based on `profiles.role`.

## Key Technical Decisions

### Accepted Technical Debt (with migration paths)
1. **No separate backend** → Build NestJS API when Edge Functions >50
2. **No Redis cache** → Add Upstash Redis when performance issues arise
3. **Basic image processing** → Add Cloudflare Images when needed
4. **No background jobs** → Add Bull/BullMQ with Redis for async tasks
5. **Basic search** → Add Algolia/Meilisearch when search quality complaints
6. **Manual payouts** → Automate with Razorpay APIs when >10 requests/week

### Multi-Tenancy
- Shared database with `community_id` foreign keys
- RLS policies filter data by community
- Community admins can only access their community data

### Data Models (Core Entities)
- `profiles` - User profiles (extends auth.users)
- `communities` - Multi-tenant communities
- `events` - Event listings with ticketing
- `games` - Board game catalog
- `discussions` - Forum posts (rules, strategy, general)
- `comments` - Threaded discussion replies
- `play_logs` - Game session tracking with scores
- `transactions` - Payment records
- `payouts` - Organizer withdrawal requests

See `plan.md` for full schema details.

## Common Development Patterns

### Server Actions (Recommended for mutations)
```typescript
'use server'
import { createClient } from '@/lib/supabase/server'

export async function createEvent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  // Insert event...
}
```

### Client Components (For interactive UI)
```typescript
'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function EventList() {
  const [events, setEvents] = useState([])
  const supabase = createClient()

  useEffect(() => {
    async function loadEvents() {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
      setEvents(data || [])
    }
    loadEvents()
  }, [])

  // Render events...
}
```

### Form Validation with Zod
```typescript
import { z } from 'zod'

export const eventSchema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  start_date: z.date(),
  ticket_price: z.number().min(0),
})
```

## Environment Variables

Required in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=         # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY=        # Supabase service role (secret!)
NEXT_PUBLIC_APP_URL=              # App URL (localhost or production)
```

Add later:
```env
RAZORPAY_KEY_ID=                  # Razorpay public key
RAZORPAY_KEY_SECRET=              # Razorpay secret key
RESEND_API_KEY=                   # Resend email API key
```

## Important Notes

- **Never commit `.env.local`** - contains secrets
- **Always use RLS policies** - never trust client-side checks alone
- **Validate user input** - use Zod schemas for all forms
- **Test auth flows** - ensure middleware is working correctly
- **Optimize images** - compress uploads, use Next.js Image component
- **Monitor costs** - track Supabase/Vercel usage, upgrade before hitting limits

## Migration Paths (When to Scale)

**Trigger: Database > 400MB**
- Upgrade to Supabase Pro ($25/month) for 8GB database

**Trigger: Storage > 5GB**
- Add Cloudflare R2 for additional storage (no egress fees)

**Trigger: Edge Functions >50 or complex workflows**
- Build separate NestJS/Express API on Railway/Render
- Keep Supabase for auth, database, storage

**Trigger: Need background jobs**
- Add Upstash Redis + Bull for job queues

**Trigger: Poor search experience**
- Integrate Algolia or self-hosted Meilisearch

**Trigger: Organizer payout requests >10/week**
- Automate payouts using Razorpay Route/Transfer APIs

See `plan.md` for detailed migration strategy.
