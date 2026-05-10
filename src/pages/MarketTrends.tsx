import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Globe, 
  Calendar, 
  ArrowUp, 
  ArrowDown, 
  Activity,
  Zap,
  LayoutGrid
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

const trendData = [
  { day: 'Mon', organic: 400, search: 240, social: 210 },
  { day: 'Tue', organic: 600, search: 139, social: 310 },
  { day: 'Wed', organic: 900, search: 980, social: 410 },
  { day: 'Thu', organic: 780, search: 390, social: 210 },
  { day: 'Fri', organic: 1100, search: 480, social: 510 },
  { day: 'Sat', organic: 1400, search: 380, social: 810 },
  { day: 'Sun', organic: 1200, search: 430, social: 710 },
];

const categoryData = [
  { name: 'Home & Kitchen', value: 35, color: '#4F46E5' },
  { name: 'Electronics', value: 25, color: '#10B981' },
  { name: 'Beauty', value: 20, color: '#F59E0B' },
  { name: 'Sports', value: 15, color: '#EF4444' },
  { name: 'Others', value: 5, color: '#8B5CF6' },
];

export default function MarketTrends() {
  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-6xl font-serif italic tracking-tighter text-ink">Market Trends</h1>
          <p className="text-sm font-medium opacity-60 mt-4 lowercase tracking-tight">Global e-commerce trajectory and category performance analytics.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-full border border-ink/10">
          <Calendar className="h-4 w-4 text-brand-orange" />
          <span className="text-[10px] font-black text-ink uppercase tracking-widest">May 01 — May 07, 2026</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 editorial-card p-10">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-8">
              <h3 className="text-3xl font-serif italic">Search Volume Analysis</h3>
              <div className="flex items-center gap-6">
                <span className="flex items-center editorial-label !opacity-100">
                  <div className="w-2 h-2 rounded-full bg-brand-orange mr-2" />
                  Organic
                </span>
                <span className="flex items-center editorial-label !opacity-100">
                  <div className="w-2 h-2 rounded-full bg-ink mr-2" />
                  Social
                </span>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#14141410" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#14141440', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#14141440', fontSize: 10, fontWeight: 700}} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141414', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '10px' }}
                />
                <Line type="monotone" dataKey="organic" stroke="#F27D26" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6, fill: '#F27D26', stroke: '#fff', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="social" stroke="#141414" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="editorial-card p-10 flex flex-col items-center">
          <h3 className="text-2xl font-serif italic mb-10 w-full">Global Share</h3>
          <div className="h-[250px] w-full relative mb-12">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#F27D26' : index % 2 === 0 ? '#141414' : '#14141460'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-serif italic text-ink">84%</span>
              <span className="editorial-label !text-[8px]">Index Rate</span>
            </div>
          </div>
          <div className="w-full space-y-4">
            {categoryData.map((cat, idx) => (
              <div key={cat.name} className="flex items-center justify-between border-b border-ink/5 pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{cat.name}</span>
                <span className="text-xs font-mono font-bold">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'E-commerce Traffic', value: '+14%', icon: Activity },
          { label: 'Ad Costs (CPC)', value: '-8.2%', icon: Zap },
          { label: 'Conversion Rates', value: '+2.1%', icon: TrendingUp },
          { label: 'Return Rates', value: '-0.5%', icon: ArrowDown },
        ].map((metric) => (
          <div key={metric.label} className="editorial-card p-8 hover:bg-ink hover:text-white transition-all group">
            <div className="p-3 w-fit rounded bg-page-bg text-ink mb-6 group-hover:bg-brand-orange group-hover:text-white transition-colors">
              <metric.icon className="h-5 w-5" />
            </div>
            <p className="editorial-label group-hover:opacity-100">{metric.label}</p>
            <p className="text-3xl font-mono font-bold mt-2">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-ink rounded-3xl p-16 text-white relative overflow-hidden shadow-2xl flex flex-col items-center text-center">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-orange/20 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <span className="editorial-label !text-brand-orange !opacity-100 mb-8 block">Intelligence Report</span>
          <h2 className="text-6xl font-serif italic leading-[1.1] tracking-tighter">Predict the next dominant category with NicheNAV AI</h2>
          <p className="mt-8 text-white/50 text-xl font-medium max-w-xl mx-auto leading-relaxed">
            Predictive modeling identifies emerging trends multiple quarters before mainstream market saturation.
          </p>
          <button className="mt-12 bg-brand-orange text-white px-12 py-4 rounded-full text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-orange/40 hover:scale-105 transition-all active:scale-95 group">
            Unlock Full Prognosis
          </button>
        </div>
      </div>
    </div>
  );
}
