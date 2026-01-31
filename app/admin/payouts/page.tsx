import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { DollarSign, Clock } from 'lucide-react'
import PayoutActions from './PayoutActions'

export default async function AdminPayoutsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  // Get pending payouts
  const { data: pendingPayouts } = await supabase
    .from('organizer_payouts')
    .select(`
      *,
      organizer:profiles!organizer_id(name, email)
    `)
    .eq('status', 'pending')
    .order('requested_at', { ascending: true })

  // Get recent payouts
  const { data: recentPayouts } = await supabase
    .from('organizer_payouts')
    .select(`
      *,
      organizer:profiles!organizer_id(name, email),
      processor:profiles!processed_by(name)
    `)
    .in('status', ['completed', 'rejected'])
    .order('processed_at', { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-background art-bg pt-16">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-8 uppercase">
          Payout Management
        </h1>

        {/* Pending Payouts */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Clock size={24} strokeWidth={2.5} className="text-sunny" />
            <h2 className="text-2xl font-black text-foreground uppercase">
              Pending Approval ({pendingPayouts?.length || 0})
            </h2>
          </div>

          {!pendingPayouts || pendingPayouts.length === 0 ? (
            <div className="bg-card border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] p-8 text-center">
              <p className="text-sm text-foreground font-mono">No pending payout requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingPayouts.map((payout) => (
                <div
                  key={payout.id}
                  className="bg-card border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-black text-foreground mb-1">
                        {payout.organizer?.name || 'Unknown Organizer'}
                      </p>
                      <p className="text-sm font-mono text-foreground">
                        {payout.organizer?.email}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground mt-1">
                        Requested: {new Date(payout.requested_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-foreground">
                        ₹{payout.amount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {payout.bank_details && (
                    <div className="bg-muted border-2 border-ink p-4 mb-4">
                      <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                        Bank Details
                      </p>
                      <p className="text-sm font-mono text-foreground">{payout.bank_details}</p>
                    </div>
                  )}

                  <PayoutActions payoutId={payout.id} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Payouts */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <DollarSign size={24} strokeWidth={2.5} className="text-mint" />
            <h2 className="text-2xl font-black text-foreground uppercase">
              Recent Payouts
            </h2>
          </div>

          {!recentPayouts || recentPayouts.length === 0 ? (
            <div className="bg-card border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] p-8 text-center">
              <p className="text-sm text-foreground font-mono">No payout history</p>
            </div>
          ) : (
            <div className="bg-card border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted border-b-2 border-ink">
                  <tr>
                    <th className="text-left p-4 font-bold text-foreground uppercase text-xs tracking-wider">
                      Organizer
                    </th>
                    <th className="text-right p-4 font-bold text-foreground uppercase text-xs tracking-wider">
                      Amount
                    </th>
                    <th className="text-center p-4 font-bold text-foreground uppercase text-xs tracking-wider">
                      Status
                    </th>
                    <th className="text-center p-4 font-bold text-foreground uppercase text-xs tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayouts.map((payout) => (
                    <tr key={payout.id} className="border-b border-ink/20">
                      <td className="p-4">
                        <p className="font-bold text-foreground">{payout.organizer?.name}</p>
                        <p className="text-xs font-mono text-muted-foreground">
                          by {payout.processor?.name || 'Unknown'}
                        </p>
                      </td>
                      <td className="text-right p-4 font-black text-foreground">
                        ₹{payout.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="text-center p-4">
                        <span className={`inline-block px-3 py-1 border-2 border-ink font-bold text-xs uppercase ${
                          payout.status === 'completed' ? 'bg-mint text-ink' : 'bg-coral text-white'
                        }`}>
                          {payout.status}
                        </span>
                      </td>
                      <td className="text-center p-4 text-xs font-mono text-foreground">
                        {payout.processed_at && new Date(payout.processed_at).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
