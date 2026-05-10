import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { 
  TrendingUp, 
  Calendar, 
  ArrowDown, 
  Activity,
  Zap,
  Loader2,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import React, { useState } from "react";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

interface Prognosis {
  dominantCategory: string;
  confidenceScore: number;
  forecastSummary: string;
  riskyMarkers: string[];
  opportunityWindows: { month: string; strength: string }[];
}

export default function MarketTrends() {
  const [isPrognosisOpen, setIsPrognosisOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prognosis, setPrognosis] = useState<Prognosis | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      alert("Prognosis report exported to PDF.");
    }, 1500);
  };

  const fetchPrognosis = async () => {
    setLoading(true);
    setIsPrognosisOpen(true);
    
    const prompt = `
      Perform a deep-market prognosis for mid-to-late 2026 e-commerce trends.
      Identify the single most dominant emerging category, provide a confidence score (0-100), 
      a detailed forecast summary, 3 risky market markers, and a 4-month opportunity window roadmap.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              dominantCategory: { type: Type.STRING },
              confidenceScore: { type: Type.NUMBER },
              forecastSummary: { type: Type.STRING },
              riskyMarkers: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunityWindows: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    month: { type: Type.STRING },
                    strength: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["dominantCategory", "confidenceScore", "forecastSummary", "riskyMarkers", "opportunityWindows"]
          }
        }
      });
      
      setPrognosis(JSON.parse(response.text));
    } catch (error) {
      console.error("Prognosis error:", error);
    } finally {
      setLoading(false);
    }
  };

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
          <button 
            onClick={fetchPrognosis}
            className="mt-12 bg-brand-orange text-white px-12 py-4 rounded-full text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-orange/40 hover:scale-105 transition-all active:scale-95 group"
          >
            Unlock Full Prognosis
          </button>
        </div>
      </div>

      {/* Prognosis Modal */}
      <AnimatePresence>
        {isPrognosisOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink/90 backdrop-blur-xl"
              onClick={() => setIsPrognosisOpen(false)}
            />
            {loading ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 flex flex-col items-center"
              >
                <Loader2 className="h-12 w-12 text-brand-orange animate-spin mb-6" />
                <p className="editorial-label !text-white !opacity-100">Running Predictive Models...</p>
              </motion.div>
            ) : prognosis && (
              <motion.div 
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.95 }}
                className="relative z-10 bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              >
                <div className="flex flex-col lg:flex-row h-full">
                  <div className="lg:w-1/3 bg-ink p-12 text-white border-r border-white/5">
                    <span className="editorial-label !text-brand-orange mb-4 block">DOMINANT CATEGORY</span>
                    <h3 className="text-5xl font-serif italic mb-10 tracking-tighter leading-none">{prognosis.dominantCategory}</h3>
                    
                    <div className="space-y-8">
                      <div>
                        <p className="editorial-label !text-white/40 mb-3">Confidence Index</p>
                        <div className="flex items-center gap-4">
                          <span className="text-4xl font-mono font-bold text-brand-orange">{prognosis.confidenceScore}%</span>
                          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${prognosis.confidenceScore}%` }}
                              className="h-full bg-brand-orange" 
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="editorial-label !text-white/40 mb-3">Volatility Risks</p>
                        <ul className="space-y-3">
                          {prognosis.riskyMarkers.map((marker, i) => (
                            <li key={i} className="flex items-start gap-3 text-xs opacity-70">
                              <AlertCircle className="h-3 w-3 text-brand-orange flex-shrink-0 mt-0.5" />
                              {marker}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-2/3 p-12 bg-white">
                    <div className="flex justify-between items-center mb-10">
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-brand-orange" />
                        <h4 className="text-2xl font-serif italic">Market Outlook v.Pro</h4>
                      </div>
                      <button onClick={() => setIsPrognosisOpen(false)} className="editorial-label !opacity-40 hover:!opacity-100 transition-all">Close Report</button>
                    </div>

                    <div className="space-y-12">
                      <p className="text-xl font-medium leading-relaxed italic opacity-80 border-l-4 border-brand-orange pl-8">
                        "{prognosis.forecastSummary}"
                      </p>

                      <div>
                        <p className="editorial-label !opacity-40 mb-6">OPPORTUNITY WINDOW ROADMAP</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {prognosis.opportunityWindows.map((win, i) => (
                            <div key={i} className="p-6 bg-page-bg border border-ink/5 rounded-sm hover:border-brand-orange/30 transition-all group">
                              <p className="editorial-label !opacity-30 mb-2">{win.month}</p>
                              <p className="text-xs font-black uppercase tracking-widest group-hover:text-brand-orange transition-colors">{win.strength}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-8 border-t border-ink/5 flex justify-between items-center">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Data Integrity Sync: Nominal</p>
                        <button 
                          onClick={handleExport}
                          disabled={exporting}
                          className="bg-ink text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-orange transition-all flex items-center gap-2"
                        >
                          {exporting && <Loader2 className="h-3 w-3 animate-spin" />}
                          {exporting ? "Exporting..." : "Export Full PDF"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
