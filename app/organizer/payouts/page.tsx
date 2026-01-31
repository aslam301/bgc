import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react'
import PayoutRequestForm from './PayoutRequestForm'

export default async function OrganizerPayoutsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is organizer
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'organizer') {
    redirect('/dashboard')
  }

  // Get organizer's earnings (mock calculation - should use RPC function)
  const { data: transactions } = await supabase
    .from('transactions')
    .select('amount, platform_fee')
    .eq('organizer_id', user.id)
    .eq('status', 'completed')

  const totalEarnings = transactions?.reduce(
    (sum, t) => sum + (t.amount - (t.platform_fee || 0)),
    0
  ) || 0

  // Get total paid out
  const { data: payouts } = await supabase
    .from('organizer_payouts')
    .select('amount')
    .eq('organizer_id', user.id)
    .eq('status', 'completed')

  const totalPaidOut = payouts?.reduce((sum, p) => sum + p.amount, 0) || 0

  const availableBalance = totalEarnings - totalPaidOut

  // Get payout history
  const { data: payoutHistory } = await supabase
    .from('organizer_payouts')
    .select('*')
    .eq('organizer_id', user.id)
    .order('requested_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background art-bg pt-16">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-8 uppercase">
          Payouts & Earnings
        </h1>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-mint/20 border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={20} strokeWidth={2.5} className="text-foreground" />
              <p className="text-sm font-bold text-foreground uppercase tracking-wider">Available Balance</p>
            </div>
            <p className="text-3xl font-black text-foreground">₹{availableBalance.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-coral/20 border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={20} strokeWidth={2.5} className="text-foreground" />
              <p className="text-sm font-bold text-foreground uppercase tracking-wider">Total Earned</p>
            </div>
            <p className="text-3xl font-black text-foreground">₹{totalEarnings.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-sunny/20 border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={20} strokeWidth={2.5} className="text-foreground" />
              <p className="text-sm font-bold text-foreground uppercase tracking-wider">Total Paid Out</p>
            </div>
            <p className="text-3xl font-black text-foreground">₹{totalPaidOut.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Request Payout */}
        <div className="bg-card border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] p-6 mb-8">
          <h2 className="text-xl font-black text-foreground mb-4 uppercase">Request Payout</h2>
          <p className="text-sm text-foreground font-mono mb-4">
            Minimum payout amount: ₹500. Payouts are processed within 5-7 business days.
          </p>
          <PayoutRequestForm availableBalance={availableBalance} />
        </div>

        {/* Payout History */}
        <div className="bg-card border-2 border-ink shadow-[4px_4px_0_0_hsl(var(--ink))] p-6">
          <h2 className="text-xl font-black text-foreground mb-6 uppercase">Payout History</h2>

          {!payoutHistory || payoutHistory.length === 0 ? (
            <p className="text-sm text-foreground font-mono text-center py-8">
              No payout requests yet
            </p>
          ) : (
            <div className="space-y-3">
              {payoutHistory.map((payout) => (
                <div
                  key={payout.id}
                  className="flex items-center justify-between p-4 border-2 border-ink bg-muted"
                >
                  <div className="flex items-center gap-4">
                    {payout.status === 'pending' && (
                      <Clock size={20} strokeWidth={2.5} className="text-sunny" />
                    )}
                    {payout.status === 'completed' && (
                      <CheckCircle size={20} strokeWidth={2.5} className="text-mint" />
                    )}
                    {payout.status === 'rejected' && (
                      <XCircle size={20} strokeWidth={2.5} className="text-coral" />
                    )}

                    <div>
                      <p className="font-black text-foreground">₹{payout.amount.toLocaleString('en-IN')}</p>
                      <p className="text-xs font-mono text-foreground">
                        {new Date(payout.requested_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className={`px-3 py-1 border-2 border-ink font-bold text-xs uppercase ${
                    payout.status === 'pending' ? 'bg-sunny text-ink' :
                    payout.status === 'completed' ? 'bg-mint text-ink' :
                    'bg-coral text-white'
                  }`}>
                    {payout.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
