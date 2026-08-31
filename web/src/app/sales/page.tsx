import Header from '@/components/layout/Header';

export default function SalesPage() {
  return (
    <div className="space-y-8">
      <Header
        title="Sales Analytics"
        description="Detailed sales performance metrics"
      />
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 text-center">
        <p className="text-gray-400">Coming in Phase 9</p>
      </div>
    </div>
  );
}
