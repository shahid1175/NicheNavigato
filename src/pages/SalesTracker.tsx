import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ArrowUpRight,
  ArrowDownRight,
  LineChart as LineChartIcon,
  Calendar,
  Filter
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

const salesData = [
  { date: '2026-05-01', revenue: 1200, units: 14, profit: 450 },
  { date: '2026-05-02', revenue: 1600, units: 18, profit: 620 },
  { date: '2026-05-03', revenue: 900, units: 10, profit: 310 },
  { date: '2026-05-04', revenue: 2100, units: 22, profit: 840 },
  { date: '2026-05-05', revenue: 1800, units: 19, profit: 710 },
  { date: '2026-05-06', revenue: 2400, units: 28, profit: 980 },
  { date: '2026-05-07', revenue: 3100, units: 34, profit: 1250 },
];

export default function SalesTracker() {
  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-6xl font-serif italic tracking-tighter text-ink">Sales Tracker</h1>
          <p className="text-sm font-medium opacity-60 mt-4 lowercase tracking-tight">Real-time revenue monitoring and inventory health tracking.</p>
        </div>
        <div className="flex gap-4">
          <button className="editorial-label border border-ink/10 px-6 py-2.5 rounded-full hover:bg-ink hover:text-white transition-all flex items-center">
            <Filter className="mr-2 h-3 w-3" />
            Category
          </button>
          <button className="editorial-label border border-ink/10 px-6 py-2.5 rounded-full hover:bg-ink hover:text-white transition-all flex items-center">
            <Calendar className="mr-2 h-3 w-3" />
            Range
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Revenue', value: '$13,100', change: '+$2.4k', trend: 'up', icon: DollarSign },
          { label: 'Units Sold', value: '145', change: '+12', trend: 'up', icon: ShoppingBag },
          { label: 'Profit Margin', value: '38.4%', change: '-0.2%', trend: 'down', icon: TrendingUp },
        ].map((stat) => (
          <div key={stat.label} className="editorial-card p-10 flex flex-col justify-between hover:bg-brand-orange/[0.02] cursor-default group transition-colors">
            <div className="flex justify-between items-start mb-10">
              <div className="p-4 bg-page-bg rounded-sm text-ink group-hover:bg-brand-orange group-hover:text-white transition-colors">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className={cn(
                "text-[10px] font-black italic",
                stat.trend === 'up' ? "text-emerald-600" : "text-rose-600"
              )}>
                {stat.change}
              </div>
            </div>
            <div>
              <p className="editorial-label !opacity-40 mb-2">{stat.label}</p>
              <p className="text-4xl font-serif italic tracking-tighter text-ink">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="editorial-card p-10 bg-white">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-3xl font-serif italic">Revenue Distribution</h3>
            <p className="editorial-label !opacity-40">Daily financial trajectory (USD)</p>
          </div>
          <div className="flex border border-ink/10 rounded-sm overflow-hidden">
            {['Revenue', 'Profit', 'Units'].map((tab, i) => (
              <button key={tab} className={cn(
                "px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                i === 0 ? "bg-ink text-white" : "hover:bg-ink/5"
              )}>{tab}</button>
            ))}
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F27D26" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#F27D26" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#14141410" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#14141440', fontSize: 10, fontWeight: 700}} 
                dy={10} 
                tickFormatter={(val) => val.split('-')[2]} 
              />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#14141440', fontSize: 10, fontWeight: 700}} dx={-10} prefix="$" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141414', border: 'none', borderRadius: '4px', color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#F27D26" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#revenueGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="editorial-card px-10 py-10">
          <h3 className="text-3xl font-serif italic mb-10">Inventory Health</h3>
          <div className="divide-y divide-ink/5">
            {[
              { name: 'Eco Espresso Maker', stock: 12, status: 'Low Stock', color: 'rose' },
              { name: 'Bamboo Organizer Set', stock: 145, status: 'Healthy', color: 'emerald' },
              { name: 'Under-Desk Treadmill', stock: 5, status: 'Critical', color: 'rose' },
              { name: 'Ergonomic Chair Pro', stock: 42, status: 'Healthy', color: 'emerald' },
            ].map((product) => (
              <div key={product.name} className="py-6 first:pt-0 last:pb-0 flex items-center justify-between group">
                <div className="flex items-center gap-6">
                  <div className="h-12 w-12 bg-page-bg border border-ink/5 rounded flex items-center justify-center text-ink/20 group-hover:text-brand-orange group-hover:border-brand-orange/30 transition-all">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-base font-serif italic text-ink">{product.name}</p>
                    <p className="editorial-label !text-[9px] !opacity-30">{product.stock} units remaining</p>
                  </div>
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  product.color === 'rose' ? "text-rose-600" : "text-emerald-600"
                )}>
                  {product.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-orange p-12 rounded-xl text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <LineChartIcon className="h-64 w-64 text-white group-hover:scale-110 transition-transform duration-1000" />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <span className="editorial-label !text-white/40 block mb-6">Optimization Engine</span>
              <h3 className="text-4xl font-serif italic leading-tight">Archetype Auto-Restock Strategy</h3>
              <p className="mt-6 text-white/70 text-lg leading-relaxed font-medium">
                Velocity modeling suggests restocking within 4 days for "Eco Espresso Maker" to avoid market displacement. 
                Projected impact: <span className="text-white font-black">+$4,200</span>.
              </p>
            </div>
            <button className="mt-12 bg-white text-brand-orange px-10 py-4 rounded-full text-[12px] font-black uppercase tracking-widest shadow-2xl shadow-brand-orange/40 hover:scale-105 transition-all active:scale-95 w-fit">
              Initiate Restock Protocol
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
