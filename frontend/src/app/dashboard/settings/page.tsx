'use client';

import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useRequireAuth } from '@/components/ProtectedRoute';
import { Card, CardBody, Heading, Text } from '@/components/ui';

export default function SettingsPage() {
  const { loading } = useRequireAuth();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen text-white/60">
          Loading performance settings...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-3">
          <Heading level={1} className="text-white">
            Performance Settings
          </Heading>
          <Text className="text-slate-400 max-w-2xl">
            Configure trading alerts, risk thresholds, and chart overlays to match your strategy.
          </Text>
        </div>

        <Card className="bg-[#131722] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.32)]">
          <CardBody className="space-y-4">
            <Text className="text-slate-300">
              Use this page to tune your strategy settings, notification preferences, and performance
              thresholds for a better trading experience.
            </Text>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
