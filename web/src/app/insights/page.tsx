import Header from '@/components/layout/Header';

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <Header
        title="Insights"
        description="Data relationships and findings"
      />
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 text-center">
        <p className="text-gray-400">Coming in Phase 9</p>
      </div>
    </div>
  );
}
