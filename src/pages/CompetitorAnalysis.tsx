import { 
  Users, 
  ArrowRight, 
  BarChart3, 
  Tag as TagIcon, 
  MessageSquare, 
  Zap, 
  Star,
  Plus,
  Bell,
  X,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import React, { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

const pricingData = [
  { brand: 'Competitor A', price: 29.99, rating: 4.8 },
  { brand: 'Competitor B', price: 34.50, rating: 4.5 },
  { brand: 'Competitor C', price: 24.99, rating: 4.2 },
  { brand: 'You (Target)', price: 28.00, rating: 0 },
];

const initialCompetitors = [
  { id: 1, name: "EcoHome Pro", health: "High", share: "12%", ads: "Aggressive", reviews: "4.8k", trend: [10, 15, 8, 22, 18, 25, 30] },
  { id: 2, name: "ZestLiving", health: "Moderate", share: "8%", ads: "Normal", reviews: "2.1k", trend: [30, 28, 35, 20, 22, 15, 12] },
  { id: 3, name: "PureNiche", health: "Rising", share: "5%", ads: "Aggressive", reviews: "0.9k", trend: [5, 8, 12, 10, 15, 18, 28] },
];

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  const min = Math.min(...data);
  const max = Math.max(...data || [1]);
  const range = max - min || 1;
  const width = 40;
  const height = 12;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible opacity-50">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

interface Alert {
  id: string;
  rivalName: string;
  metric: string;
  threshold: string;
  status: 'active' | 'triggered';
}

export default function CompetitorAnalysis() {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedRival, setSelectedRival] = useState<typeof initialCompetitors[0] | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', rivalName: 'EcoHome Pro', metric: 'Market Share', threshold: '> 15%', status: 'active' },
    { id: '2', rivalName: 'PureNiche', metric: 'Review Velocity', threshold: '> 50/week', status: 'triggered' },
  ]);

  const openAlertConfig = (rival: typeof initialCompetitors[0]) => {
    setSelectedRival(rival);
    setIsAlertModalOpen(true);
  };

  const saveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRival) return;
    
    const form = e.target as HTMLFormElement;
    const newAlert: Alert = {
      id: Date.now().toString(),
      rivalName: selectedRival.name,
      metric: (form.elements.namedItem('metric') as HTMLSelectElement).value,
      threshold: (form.elements.namedItem('threshold') as HTMLInputElement).value,
      status: 'active'
    };
    
    setAlerts([newAlert, ...alerts]);
    setIsAlertModalOpen(false);
  };

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-6xl font-serif italic tracking-tighter text-ink">Competitor Analysis</h1>
          <p className="text-sm font-medium opacity-60 mt-4 lowercase tracking-tight">Track and outpace your rivals in the e-commerce landscape.</p>
        </div>
        <button className="bg-ink text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-orange transition-all shadow-xl shadow-ink/20 flex items-center">
          <Plus className="mr-2 h-3.5 w-3.5" />
          Track New Rival
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="editorial-card p-10 bg-white">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-3xl font-serif italic">Pricing Benchmark</h3>
                <p className="editorial-label !opacity-40">Indexed vs. Target Pricing</p>
              </div>
              <div className="p-3 bg-page-bg rounded-sm">
                <TagIcon className="h-5 w-5 text-brand-orange" />
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pricingData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#14141410" />
                  <XAxis dataKey="brand" axisLine={false} tickLine={false} tick={{fill: '#14141440', fontSize: 10, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#14141440', fontSize: 10, fontWeight: 700}} dx={-10} prefix="$" />
                  <Tooltip 
                    cursor={{fill: '#14141405'}}
                    contentStyle={{ backgroundColor: '#141414', border: 'none', borderRadius: '4px', color: '#fff' }}
                  />
                  <Bar dataKey="price" fill="#F27D26" radius={[2, 2, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="editorial-card overflow-hidden">
            <div className="px-10 py-6 border-b border-ink/5 bg-ink/[0.01]">
              <h3 className="text-2xl font-serif italic">Rivalry Watchlist</h3>
            </div>
            <div className="divide-y divide-ink/5">
              {initialCompetitors.map((comp) => (
                <div key={comp.id} className="px-10 py-8 flex items-center justify-between hover:bg-brand-orange/[0.02] transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 bg-page-bg border border-ink/5 rounded flex items-center justify-center font-serif italic text-xl group-hover:border-brand-orange/30 transition-all">
                      {comp.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-serif italic leading-none">{comp.name}</h4>
                        <Sparkline data={comp.trend} color={comp.trend[comp.trend.length - 1] > comp.trend[0] ? '#10b981' : '#ef4444'} />
                      </div>
                      <p className="editorial-label !text-[9px] !opacity-30">{comp.reviews} reviews · {comp.share} market penetration</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12 text-right">
                    <div className="hidden md:block">
                      <p className="editorial-label !text-[8px] mb-1">Marketing</p>
                      <span className={cn(
                        "text-[10px] font-black italic",
                        comp.ads === 'Aggressive' ? "text-rose-600" : "text-emerald-600"
                      )}>{comp.ads.toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="editorial-label !text-[8px] mb-1">Alerts</p>
                      <button 
                        onClick={() => openAlertConfig(comp)}
                        className="p-1 px-3 border border-ink/10 rounded-full hover:bg-ink hover:text-white transition-all text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"
                      >
                        <Bell className="h-2.5 w-2.5" />
                        Configure
                      </button>
                    </div>
                    <button className="p-3 border border-ink/10 rounded-full hover:bg-ink hover:text-white transition-all">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-ink p-10 rounded-xl text-white relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-orange/40 to-transparent opacity-20" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-serif italic">Alert Ledger</h3>
                <Bell className="h-5 w-5 text-brand-orange animate-pulse" />
              </div>
              <div className="space-y-4">
                {alerts.length === 0 ? (
                  <p className="text-white/40 text-[10px] uppercase font-bold italic tracking-widest text-center py-8 border border-white/5 rounded">No active protocols</p>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className="p-4 bg-white/5 border border-white/5 rounded group/item hover:border-brand-orange/30 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest">{alert.rivalName}</span>
                        {alert.status === 'triggered' && <AlertTriangle className="h-3 w-3 text-rose-500" />}
                      </div>
                      <p className="text-xs font-medium text-white/80">{alert.metric} {alert.threshold}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-[8px] font-black uppercase tracking-tighter opacity-30">{alert.status === 'active' ? 'Monitoring' : 'Threshold Breached'}</span>
                        <button 
                          onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))}
                          className="opacity-0 group-hover/item:opacity-40 hover:opacity-100 transition-all"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="editorial-card p-10">
            <h3 className="text-2xl font-serif italic mb-8">Sentiment Coefficient</h3>
            <div className="space-y-8">
              {[
                { label: 'Market Sentiment', value: 88 },
                { label: 'Logistics Velocity', value: 72 },
                { label: 'Archetype Quality', value: 94 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-end mb-3">
                    <span className="editorial-label !opacity-60">{item.label}</span>
                    <span className="text-lg font-mono font-bold italic text-brand-orange">{item.value}%</span>
                  </div>
                  <div className="h-1 w-full bg-ink/[0.03] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1.5, ease: 'circOut' }}
                      className="h-full bg-ink" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alert Configuration Modal */}
      <AnimatePresence>
        {isAlertModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink/80 backdrop-blur-md"
              onClick={() => setIsAlertModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-page-bg w-full max-w-lg rounded-xl overflow-hidden border border-ink/10 shadow-2xl"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="editorial-label !text-brand-orange mb-2 block">Protocol Configuration</span>
                    <h2 className="text-4xl font-serif italic tracking-tighter">Monitoring: {selectedRival?.name}</h2>
                  </div>
                  <button onClick={() => setIsAlertModalOpen(false)} className="p-2 hover:bg-ink/5 rounded-full transition-all">
                    <X className="h-5 w-5 opacity-40" />
                  </button>
                </div>

                <form onSubmit={saveAlert} className="space-y-8">
                  <div className="space-y-4">
                    <label className="editorial-label !opacity-40">Observation Metric</label>
                    <select 
                      name="metric"
                      className="w-full bg-white border border-ink/10 px-6 py-4 rounded-lg font-serif italic text-lg outline-none focus:border-brand-orange transition-all appearance-none"
                    >
                      <option>Market Share Variation</option>
                      <option>Advertising Aggressiveness</option>
                      <option>Review Velocity Index</option>
                      <option>Pricing Fluctuation</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="editorial-label !opacity-40">Sensitivity Threshold</label>
                    <input 
                      name="threshold"
                      type="text" 
                      placeholder="e.g. > 15% shift"
                      className="w-full bg-white border border-ink/10 px-6 py-4 rounded-lg font-serif italic text-lg outline-none focus:border-brand-orange transition-all placeholder:opacity-20"
                      required
                    />
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit"
                      className="w-full bg-ink text-white py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-orange transition-all shadow-xl shadow-ink/10"
                    >
                      Establish Monitoring Protocol
                    </button>
                    <p className="text-[9px] text-center mt-6 uppercase tracking-widest opacity-30 font-bold">
                      Notification will be dispatched via secure channel upon threshold breach.
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
