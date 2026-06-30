'use client';

import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useRequireAuth } from '@/components/ProtectedRoute';
import { Card, CardBody, Heading, Text } from '@/components/ui';

export default function OverviewAnalyticsPage() {
  const { loading } = useRequireAuth();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen text-white/60">
          Loading overview analytics...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-3">
          <Heading level={1} className="text-white">
            Overview Analytics
          </Heading>
          <Text className="text-slate-400 max-w-2xl">
            View your portfolio performance, market momentum, and account trends in one place.
          </Text>
        </div>

        <Card className="bg-[#131722] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.32)]">
          <CardBody className="space-y-4">
            <Text className="text-slate-300">
              This is a placeholder analytics view. Add charts, KPI cards, and trend reports here to
              make the overview actionable for users.
            </Text>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
