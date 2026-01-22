# BoardGameCulture - Development Setup Guide

This guide will walk you through setting up the BoardGameCulture platform from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18+ and npm (or pnpm/yarn)
- **Git** for version control
- A code editor (VS Code recommended)
- A **Supabase** account (free tier)
- A **Vercel** account (free tier, optional for deployment)

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name:** boardgameculture
   - **Database Password:** Generate a strong password (save it!)
   - **Region:** Choose closest to India (e.g., Mumbai, Singapore)
   - **Pricing Plan:** Free
4. Wait 2-3 minutes for project creation
5. Save these credentials from Settings → API:
   - **Project URL** (e.g., https://xxxxx.supabase.co)
   - **Anon/Public Key** (starts with `eyJ...`)
   - **Service Role Key** (starts with `eyJ...`, keep this secret!)

---

## Step 2: Initialize Next.js Project

```bash
# Navigate to the project directory
cd C:\Users\aslam.m\Desktop\MyFiles\Dev\per\boardgameculture

# Remove empty directories if they exist
rmdir frontend backend

# Create Next.js app with TypeScript
npx create-next-app@latest . --typescript --tailwind --app --use-npm

# Answer the prompts:
# ✔ Would you like to use ESLint? Yes
# ✔ Would you like to use Turbopack for next dev? No
# ✔ Would you like to customize the import alias? No
```

---

## Step 3: Install Dependencies

```bash
# Supabase client
npm install @supabase/supabase-js @supabase/ssr

# UI components (shadcn/ui dependencies)
npm install class-variance-authority clsx tailwind-merge lucide-react

# Form handling
npm install react-hook-form @hookform/resolvers zod

# Date handling
npm install date-fns

# Development dependencies
npm install -D @types/node
```

---

## Step 4: Set Up shadcn/ui

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Answer the prompts:
# ✔ Which style would you like to use? › Default
# ✔ Which color would you like to use as base color? › Slate
# ✔ Would you like to use CSS variables for colors? › yes

# Install commonly used components
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add dropdown-menu
npx shadcn@latest add dialog
npx shadcn@latest add toast
npx shadcn@latest add form
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add calendar
```

---

## Step 5: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Razorpay (add later)
# RAZORPAY_KEY_ID=
# RAZORPAY_KEY_SECRET=

# Resend (add later)
# RESEND_API_KEY=
```

**Important:** Add `.env.local` to `.gitignore` (it should already be there)

---

## Step 6: Set Up Supabase Client

Create `lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

Create `lib/supabase/server.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
```

Create `lib/supabase/middleware.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  await supabase.auth.getUser()

  return supabaseResponse
}
```

Create `middleware.ts` in root:

```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

## Step 7: Create Database Schema

Go to your Supabase project → SQL Editor and run this initial schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'organizer', 'community_admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile automatically
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Communities table
CREATE TABLE public.communities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  admin_user_id UUID REFERENCES public.profiles(id),
  settings JSONB DEFAULT '{}',
  min_payout_threshold DECIMAL(10,2) DEFAULT 500.00,  -- Minimum amount for organizer payouts
  platform_commission_rate DECIMAL(5,4) DEFAULT 0.0500,  -- Platform fee percentage (e.g., 0.05 = 5%)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Communities are viewable by everyone"
  ON public.communities FOR SELECT
  USING (true);

-- Games table
CREATE TABLE public.games (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  publisher TEXT,
  min_players INTEGER,
  max_players INTEGER,
  play_time INTEGER,
  complexity DECIMAL(3,2),
  year_published INTEGER,
  image_url TEXT,
  bgg_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Games are viewable by everyone"
  ON public.games FOR SELECT
  USING (true);

-- Events table
CREATE TABLE public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  organizer_id UUID REFERENCES public.profiles(id) NOT NULL,
  community_id UUID REFERENCES public.communities(id),
  location_city TEXT NOT NULL,
  location_venue TEXT,
  location_address TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  ticket_price DECIMAL(10,2) DEFAULT 0,
  max_attendees INTEGER,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone"
  ON public.events FOR SELECT
  USING (status = 'published' OR organizer_id = auth.uid());

CREATE POLICY "Organizers can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update own events"
  ON public.events FOR UPDATE
  USING (auth.uid() = organizer_id);

-- Create indexes for performance
CREATE INDEX idx_events_city ON public.events(location_city);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_organizer ON public.events(organizer_id);
CREATE INDEX idx_communities_slug ON public.communities(slug);
```

---

## Step 8: Update Project Structure

Create the following directory structure:

```
boardgameculture/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   └── organizer/
│   ├── (public)/
│   │   ├── events/
│   │   ├── discussions/
│   │   └── communities/
│   ├── admin/
│   ├── api/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/          # shadcn components
│   ├── auth/
│   ├── events/
│   └── layout/
├── lib/
│   ├── supabase/
│   ├── utils.ts
│   └── validations/
├── types/
│   └── database.ts
├── public/
└── .env.local
```

---

## Step 9: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see your app!

---

## Step 10: Set Up Git Repository

```bash
# Initialize git (if not already done)
git init

# Create .gitignore (should already exist from create-next-app)
# Ensure it includes:
# .env*.local
# node_modules/
# .next/
# out/

# Initial commit
git add .
git commit -m "Initial setup: Next.js + Supabase + shadcn/ui"

# Create GitHub repository and push
# (Follow GitHub instructions to add remote and push)
```

---

## Step 11: Deploy to Vercel (Optional)

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js (auto-detected)
   - **Environment Variables:** Add all variables from `.env.local`
5. Click "Deploy"
6. Your app will be live at `https://your-project.vercel.app`

---

## Next Steps

### Immediate Tasks:
1. [ ] Create authentication pages (login/signup)
2. [ ] Create homepage with basic layout
3. [ ] Create event listing page
4. [ ] Set up protected routes
5. [ ] Create user dashboard

### Database Setup:
1. [ ] Complete database schema (remaining tables)
2. [ ] Set up Row Level Security policies
3. [ ] Create database types for TypeScript
4. [ ] Set up Edge Functions for complex logic

### Configuration:
1. [ ] Set up Razorpay account and add credentials
2. [ ] Set up Resend account and add API key
3. [ ] Configure Supabase Storage buckets
4. [ ] Set up email templates

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Supabase (if using Supabase CLI)
npx supabase login       # Login to Supabase
npx supabase init        # Initialize Supabase locally
npx supabase db push     # Push schema changes
npx supabase db pull     # Pull schema from remote
npx supabase gen types typescript --project-id <project-id> > types/database.ts

# shadcn/ui
npx shadcn@latest add <component-name>  # Add new components
```

---

## Troubleshooting

### Issue: Supabase client not working
- Check environment variables are set correctly
- Ensure `.env.local` is not in `.gitignore`
- Restart dev server after adding env vars

### Issue: Auth not persisting
- Check middleware is set up correctly
- Ensure cookies are working (check browser settings)
- Check Supabase URL and keys

### Issue: Database errors
- Check Row Level Security policies
- Ensure user is authenticated
- Check SQL query syntax in Supabase logs

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Razorpay Documentation](https://razorpay.com/docs)

---

## Getting Help

If you encounter issues:
1. Check the documentation above
2. Review error messages in browser console and terminal
3. Check Supabase logs in dashboard
4. Search for solutions online
5. Ask for help in relevant communities

---

**Ready to build BoardGameCulture! 🎲**
