import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  DollarSign, 
  ShoppingBag,
  Zap,
  Target,
  BarChart2
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";
import { Link } from "react-router-dom";

const data = [
  { name: 'Jan', sales: 4000, trends: 2400 },
  { name: 'Feb', sales: 3000, trends: 1398 },
  { name: 'Mar', sales: 2000, trends: 9800 },
  { name: 'Apr', sales: 2780, trends: 3908 },
  { name: 'May', sales: 1890, trends: 4800 },
  { name: 'Jun', sales: 2390, trends: 3800 },
  { name: 'Jul', sales: 3490, trends: 4300 },
];

const stats = [
  { name: 'Active Niches', value: '12', change: '+2', trend: 'up', icon: Target },
  { name: 'Monthly Revenue', value: '£45,231.89', change: '+12.5%', trend: 'up', icon: DollarSign },
  { name: 'Market Volatility', value: 'Moderate', change: '-4%', trend: 'down', icon: Zap },
  { name: 'Competitor Mentions', value: '2.4k', change: '+18%', trend: 'up', icon: Users },
];

export default function Dashboard() {
  return (
    <div className="space-y-12">
      <header className="flex items-end justify-between">
        <div className="title-block">
          <h1 className="text-6xl font-serif italic tracking-tighter text-ink">Market Overview</h1>
          <p className="text-sm font-medium opacity-60 mt-2 lowercase tracking-tight">Real-time intelligence dashboard for niche exploration</p>
        </div>
        <div className="hidden lg:flex gap-4">
          <div className="editorial-card px-6 py-4 flex flex-col items-center justify-center min-w-[140px]">
            <p className="editorial-label mb-1 opacity-40">System Status</p>
            <p className="text-2xl font-serif italic text-brand-orange">Nominal</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="editorial-card p-6 hover:bg-brand-orange/5 cursor-default transition-colors group"
          >
            <div className="flex items-start justify-between mb-4">
              <p className="editorial-label text-brand-orange group-hover:opacity-100 transition-opacity">{stat.name}</p>
              <div className={cn(
                "text-[10px] font-black",
                stat.trend === 'up' ? "text-emerald-600" : "text-rose-600"
              )}>
                {stat.change}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-mono tracking-tighter font-bold">{stat.value}</p>
            </div>
            <p className="editorial-label !opacity-30 mt-2 !tracking-tight lowercase">Snapshot: last 24h</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 editorial-card p-8 bg-white">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-ink/5">
            <div>
              <h3 className="text-2xl font-serif italic">Sales vs Trends</h3>
              <p className="editorial-label !opacity-40">Category Performance Metric</p>
            </div>
            <div className="flex gap-2">
              {['7D', '30D', '1Y'].map(t => (
                <button key={t} className="text-[10px] font-black border border-ink/10 px-3 py-1 rounded hover:bg-ink hover:text-white transition-colors">{t}</button>
              ))}
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F27D26" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F27D26" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#14141410" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#14141440', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#14141440', fontSize: 10, fontWeight: 700}} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141414', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#F27D26" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="trends" stroke="#141414" strokeWidth={2} fill="transparent" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-brand-orange p-8 rounded-xl text-white relative overflow-hidden group">
            <Zap className="absolute -right-8 -bottom-8 h-48 w-48 text-white/10 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <span className="editorial-label !text-white/40 block mb-4">Intelligence Alert</span>
              <h3 className="text-3xl font-serif italic">Niche Surge Detected</h3>
              <p className="mt-4 text-white/70 text-sm leading-relaxed font-medium">
                "Eco-Friendly Home Office" niche is up 45% in search volume. 
                Competition score: Low.
              </p>
              <Link to="/product-database" className="mt-8 bg-white text-brand-orange px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-page-bg transition-all active:scale-95 shadow-xl shadow-brand-orange/20 inline-block text-center">
                Analyze Archetype
              </Link>
            </div>
          </div>

          <div className="editorial-card p-8">
            <h3 className="text-2xl font-serif italic mb-6">Trending Signals</h3>
            <div className="divide-y divide-ink/5">
              {[
                { label: 'Minimalist Desk Set', vol: '12.4k', growth: '+124%' },
                { label: 'Bamboo Organizers', vol: '8.2k', growth: '+85%' },
                { label: 'Ergonomic Stools', vol: '24.1k', growth: '+32%' },
                { label: 'Sustainable Lighting', vol: '5.6k', growth: '+12%' },
              ].map((kw) => (
                <div key={kw.label} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between group cursor-pointer">
                  <div>
                    <p className="text-sm font-bold text-ink group-hover:text-brand-orange transition-colors">{kw.label}</p>
                    <p className="text-[10px] font-mono opacity-40 uppercase mt-1">{kw.vol} SEARCHES</p>
                  </div>
                  <div className="text-[10px] font-black text-brand-orange border border-brand-orange/20 px-2 py-0.5 rounded italic">
                    {kw.growth}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
