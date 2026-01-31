import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { ExternalLink, MapPin, Package } from 'lucide-react'

export default async function ShopPage() {
  const supabase = await createClient()

  const { data: retailers } = await supabase
    .from('retailers')
    .select('*')
    .eq('is_verified', true)
    .order('name')

  return (
    <div className="min-h-screen bg-background art-bg pt-16">
      <Navigation />

      {/* Hero */}
      <div className="bg-coral border-b-2 border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 uppercase">
            Where to Buy
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl font-mono">
            Find trusted retailers to buy board games in India
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Disclaimer */}
        <div className="bg-sunny/20 border-2 border-ink p-4 sm:p-6 mb-8">
          <p className="text-sm text-foreground font-mono">
            <strong>Disclosure:</strong> Some links below may be affiliate links. We earn a small commission if you make a purchase, at no extra cost to you. This helps support the platform.
          </p>
        </div>

        {!retailers || retailers.length === 0 ? (
          <div className="bg-card border-2 border-ink shadow-neo-lg p-8 sm:p-12 text-center">
            <div className="text-5xl sm:text-6xl mb-4">🏪</div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground mb-2 uppercase">Retailers Coming Soon</h2>
            <p className="text-sm sm:text-base text-foreground font-mono">
              We're partnering with board game retailers across India. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {retailers.map((retailer) => (
              <div
                key={retailer.id}
                className="bg-card border-2 border-ink shadow-neo p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-black text-foreground mb-1">{retailer.name}</h3>
                    {retailer.city && (
                      <p className="text-xs text-foreground font-mono flex items-center gap-1">
                        <MapPin size={12} strokeWidth={2.5} />
                        {retailer.city}
                      </p>
                    )}
                  </div>
                  {retailer.is_verified && (
                    <span className="px-2 py-1 bg-mint text-ink border-2 border-ink text-xs font-bold uppercase">
                      ✓ Verified
                    </span>
                  )}
                </div>

                {retailer.description && (
                  <p className="text-sm text-foreground font-mono mb-4">
                    {retailer.description}
                  </p>
                )}

                <div className="space-y-2 text-xs text-foreground font-mono mb-4">
                  {retailer.has_physical_store && (
                    <p className="flex items-center gap-1">
                      <span className="text-mint">✓</span> Physical Store
                    </p>
                  )}
                  {retailer.shipping_pan_india && (
                    <p className="flex items-center gap-1">
                      <span className="text-mint">✓</span> Ships Pan-India
                    </p>
                  )}
                </div>

                <a
                  href={retailer.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-coral text-white border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold uppercase tracking-wider w-full justify-center"
                >
                  <ExternalLink size={14} strokeWidth={3} />
                  Visit Store
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
