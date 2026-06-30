'use client';

import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useRequireAuth } from '@/components/ProtectedRoute';
import { Card, CardBody, Heading, Text } from '@/components/ui';

const activeSlips = [
  { id: 'SLIP-001', event: 'BTC vs ETH', stake: 420, odds: 2.14, status: 'Pending' },
  { id: 'SLIP-002', event: 'SOL vs ADA', stake: 180, odds: 1.92, status: 'Active' },
  { id: 'SLIP-003', event: 'DOGE Bull', stake: 90, odds: 3.1, status: 'Pending' },
];

export default function SlipsPage() {
  const { loading } = useRequireAuth();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen text-white/60">
          Loading active slips...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-3">
          <Heading level={1} className="text-white">
            Active Slips
          </Heading>
          <Text className="text-slate-400 max-w-2xl">
            Review all active wager slips and follow live positions across your open markets.
          </Text>
        </div>

        <Card className="bg-[#131722] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.32)]">
          <CardBody className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-slate-300">
              <thead>
                <tr className="bg-white/5 text-slate-400">
                  <th className="px-5 py-4">Slip</th>
                  <th className="px-5 py-4">Event</th>
                  <th className="px-5 py-4">Stake</th>
                  <th className="px-5 py-4">Odds</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {activeSlips.map((slip) => (
                  <tr key={slip.id} className="border-t border-white/5">
                    <td className="px-5 py-4 text-white">{slip.id}</td>
                    <td className="px-5 py-4">{slip.event}</td>
                    <td className="px-5 py-4">${slip.stake}</td>
                    <td className="px-5 py-4">{slip.odds.toFixed(2)}</td>
                    <td className="px-5 py-4 text-[#00FF87]">{slip.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
