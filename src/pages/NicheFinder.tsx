import { useState } from "react";
import { 
  Search, 
  Filter, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  HelpCircle,
  MoreVertical,
  Star,
  ShoppingBag,
  Sparkles,
  Loader2,
  Box,
  ExternalLink,
  Globe
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { generateNicheIdeas, AINiche } from "@/src/services/geminiService";
import { fetchAmazonTrendingProducts, AmazonProduct } from "@/src/services/amazonService";

const mockNiches = [
  { id: 1, name: "Portable Espresso Makers", demand: "High", competition: "Medium", score: 84, growth: "+15%", revenue: "$120k/mo", breakdown: { demand: 85, competition: 60, growth: 75 } },
  { id: 2, name: "Biodegradable Yoga Mats", demand: "Very High", competition: "High", score: 72, growth: "+28%", revenue: "$450k/mo", breakdown: { demand: 95, competition: 40, growth: 80 } },
  { id: 3, name: "Cordless Charging Lamps", demand: "Medium", competition: "Low", score: 91, growth: "+42%", revenue: "$85k/mo", breakdown: { demand: 65, competition: 90, growth: 85 } },
  { id: 4, name: "Smart Pet Feeders", demand: "High", competition: "Medium", score: 78, growth: "+12%", revenue: "$310k/mo", breakdown: { demand: 80, competition: 65, growth: 70 } },
  { id: 5, name: "Under-Desk Treadmills", demand: "Very High", competition: "High", score: 65, growth: "+95%", revenue: "$1.2M/mo", breakdown: { demand: 90, competition: 30, growth: 95 } },
  { id: 6, name: "Magnetic Chess Sets", demand: "Low", competition: "Very Low", score: 88, growth: "+8%", revenue: "$22k/mo", breakdown: { demand: 40, competition: 95, growth: 50 } },
  { id: 7, name: "Reusable Silicone Lids", demand: "Medium", competition: "Medium", score: 76, growth: "-4%", revenue: "$45k/mo", breakdown: { demand: 70, competition: 70, growth: 40 } },
];

export default function NicheFinder() {
  const [searchTerm, setSearchTerm] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [amazonLoading, setAmazonLoading] = useState(false);
  const [aiNiches, setAiNiches] = useState<AINiche[]>([]);
  const [amazonProducts, setAmazonProducts] = useState<AmazonProduct[]>([]);
  const [interests, setInterests] = useState("");
  const [savedNiches, setSavedNiches] = useState<AINiche[]>(() => {
    const saved = localStorage.getItem("saved_niches");
    return saved ? JSON.parse(saved) : [];
  });
  const [autoSave, setAutoSave] = useState(() => {
    return localStorage.getItem("auto_save_enabled") === "true";
  });

  const [region, setRegion] = useState("Global");
  const [isParamsModalOpen, setIsParamsModalOpen] = useState(false);
  const [minScore, setMinScore] = useState(0);

  const filteredMockNiches = mockNiches.filter(n => 
    n.name.toLowerCase().includes(searchTerm.toLowerCase()) && n.score >= minScore
  );

  const handleBulkScan = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      // Maybe just toast or alert for now, but better to show feedback in UI
    }, 2000);
  };

  const handleGenerateAI = async () => {
    setAiLoading(true);
    try {
      const ideas = await generateNicheIdeas(interests);
      setAiNiches(ideas);
      
      if (autoSave) {
        const profitable = ideas.filter(n => {
          const rev = n.potentialRevenue.toLowerCase();
          const isHighRevenue = rev.includes('m') || (rev.includes('k') && parseInt(rev.replace(/[^0-9]/g, '')) >= 50);
          return isHighRevenue || n.estimatedDifficulty === 'Low' || n.opportunityScore >= 85;
        });
        
        if (profitable.length > 0) {
          setSavedNiches(prev => {
            const newSaved = [...prev];
            profitable.forEach(p => {
              if (!newSaved.find(s => s.name === p.name)) {
                newSaved.unshift(p);
              }
            });
            const limited = newSaved.slice(0, 20);
            localStorage.setItem("saved_niches", JSON.stringify(limited));
            return limited;
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAmazonScan = async () => {
    setAmazonLoading(true);
    try {
      const data = await fetchAmazonTrendingProducts(interests || "Trending Archetypes", region === "Global" ? "US" : region);
      setAmazonProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setAmazonLoading(false);
    }
  };

  const clearSaved = () => {
    setSavedNiches([]);
    localStorage.removeItem("saved_niches");
  };

  const toggleAutoSave = () => {
    const newVal = !autoSave;
    setAutoSave(newVal);
    localStorage.setItem("auto_save_enabled", String(newVal));
  };

  const saveNicheManual = (niche: AINiche) => {
    setSavedNiches(prev => {
      if (prev.find(s => s.name === niche.name)) return prev;
      const newSaved = [niche, ...prev].slice(0, 10);
      localStorage.setItem("saved_niches", JSON.stringify(newSaved));
      return newSaved;
    });
  };

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-6xl font-serif italic tracking-tighter text-ink">Niche Finder</h1>
          <p className="text-sm font-medium opacity-60 mt-4 lowercase tracking-tight">Systematic discovery of market inefficiencies and high-potential archetypes.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsParamsModalOpen(true)}
            className="editorial-label border border-ink/10 px-6 py-2.5 rounded-full hover:bg-ink hover:text-white transition-all flex items-center"
          >
            <Filter className="mr-2 h-3 w-3" />
            Parameters
          </button>
          <button 
            onClick={handleBulkScan}
            className="bg-ink text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-ink/20 hover:scale-105 transition-all flex items-center justify-center min-w-[160px]"
          >
            {aiLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Initiate Bulk Scan"}
          </button>
        </div>
      </header>

      {/* AI Section with Editorial Flair */}
      <div className="editorial-card p-10 bg-white border-2 border-ink !rounded-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 opacity-[0.03]">
          <Sparkles className="h-64 w-64 text-ink" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="h-5 w-5 text-brand-orange" />
            <h3 className="text-3xl font-serif italic tracking-tight">Niche Architect <span className="opacity-30 text-xl not-italic font-sans font-bold ml-2">v.2.4</span></h3>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 mt-8">
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <label className="editorial-label !opacity-40">Describe your domain or interest</label>
                <button 
                  onClick={toggleAutoSave}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border",
                    autoSave ? "bg-brand-orange/10 border-brand-orange text-brand-orange" : "bg-ink/5 border-transparent text-ink/40"
                  )}
                >
                  <div className={cn("w-1.5 h-1.5 rounded-full", autoSave ? "bg-brand-orange animate-pulse" : "bg-ink/20")} />
                  Auto-Save Profitable
                </button>
              </div>
              <div className="flex items-center gap-4 bg-page-bg p-2 rounded-full border border-ink/5 focus-within:border-brand-orange transition-all">
                <input 
                  type="text" 
                  placeholder="e.g. Sustainable gardening, Pet technology..." 
                  className="flex-1 bg-transparent border-none outline-none px-6 py-2 text-sm font-medium"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                />
                <button 
                  onClick={handleGenerateAI}
                  disabled={aiLoading}
                  className="bg-ink text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest disabled:opacity-50 flex items-center transition-all"
                >
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2 text-brand-orange" />}
                  Synthesize
                </button>
                <button 
                  onClick={handleAmazonScan}
                  disabled={amazonLoading}
                  className="bg-white text-ink border border-ink/10 px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest disabled:opacity-50 flex items-center transition-all hover:bg-ink hover:text-white"
                >
                  {amazonLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Box className="h-4 w-4 mr-2 text-[#FF9900]" />}
                  Amazon Hot-Scan
                </button>
              </div>
            </div>
            <div className="lg:w-1/3 flex flex-col justify-end">
              <p className="text-[10px] leading-relaxed font-medium opacity-50 uppercase tracking-wider italic">
                Our neural engines analyze over 12.4M weekly listing updates to construct unique market entry strategies tailored to your specified constraints.
              </p>
            </div>
          </div>

          <AnimatePresence>
            {amazonProducts.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-12 pt-12 border-t border-ink/5"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#FF9900] p-1.5 rounded-sm">
                      <ShoppingBag className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="text-2xl font-serif italic">Amazon Trending Archetypes</h4>
                  </div>
                  <button 
                    onClick={() => setAmazonProducts([])}
                    className="editorial-label opacity-40 hover:opacity-100 transition-opacity"
                  >
                    Clear Feed
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {amazonProducts.map((prod, idx) => (
                    <motion.div
                      key={prod.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="editorial-card p-6 bg-page-bg border border-ink/5 hover:border-[#FF9900]/30 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="editorial-label !text-[#FF9900] !opacity-100">{prod.category}</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => saveNicheManual({
                              name: prod.name,
                              category: prod.category,
                              reason: `Amazon trending product with BSR ${prod.bsr}. Monthly revenue of ${prod.revenue}.`,
                              estimatedDifficulty: prod.opportunityScore > 80 ? "Low" : "Medium",
                              potentialRevenue: prod.revenue,
                              opportunityScore: prod.opportunityScore
                            })}
                            className={cn(
                              "p-1 rounded-full transition-all hover:bg-ink hover:text-white",
                              savedNiches.find(s => s.name === prod.name) ? "text-[#FF9900] bg-[#FF9900]/5" : "opacity-20"
                            )}
                          >
                            <Star className="w-3 h-3 fill-current" />
                          </button>
                          <div className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                            prod.trend === 'Explosive' ? "bg-rose-500 text-white" : "bg-ink text-white opacity-40"
                          )}>
                            {prod.trend}
                          </div>
                        </div>
                      </div>
                      <h5 className="text-lg font-serif italic mb-4 leading-tight group-hover:text-[#FF9900] transition-colors">{prod.name}</h5>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-1">BSR</p>
                          <p className="text-xs font-mono font-bold">{prod.bsr}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-1">Mo. Revenue</p>
                          <p className="text-xs font-mono font-bold text-brand-orange">{prod.revenue}</p>
                        </div>
                      </div>

                      <div className="mb-6 p-3 bg-ink/5 rounded-sm">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-[8px] font-black uppercase tracking-widest opacity-30">BSR Velocity (7D)</p>
                          <span className="text-[9px] font-mono font-bold text-emerald-500">Keepa Verified</span>
                        </div>
                        <div className="h-8 flex items-end gap-1 px-1">
                          {prod.bsrHistory.map((val, i) => (
                            <div 
                              key={i} 
                              className="flex-1 bg-ink/20 rounded-t-sm transition-all hover:bg-brand-orange" 
                              style={{ height: `${Math.max(10, val)}%` }} 
                            />
                          ))}
                        </div>
                        <div className="flex justify-between mt-2 pt-2 border-t border-ink/5">
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest opacity-30">
                              <span>Demand / Comp / Growth</span>
                              <span className="text-brand-orange">SCORE: {prod.opportunityScore}</span>
                            </div>
                            <div className="flex gap-1 h-1.5">
                              <div className="flex-1 bg-emerald-500 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500/30" />
                                <div className="h-full bg-emerald-500 -mt-1.5" style={{ width: `${prod.breakdown?.demand}%` }} />
                              </div>
                              <div className="flex-1 bg-amber-500 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500/30" />
                                <div className="h-full bg-amber-500 -mt-1.5" style={{ width: `${prod.breakdown?.competition}%` }} />
                              </div>
                              <div className="flex-1 bg-brand-orange rounded-full overflow-hidden">
                                <div className="h-full bg-brand-orange/30" />
                                <div className="h-full bg-brand-orange -mt-1.5" style={{ width: `${prod.breakdown?.growth}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-ink/5">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-brand-orange fill-current" />
                          <span className="text-[10px] font-bold">{prod.rating}</span>
                        </div>
                        <a 
                          href={region === "UK" ? `https://www.amazon.co.uk/s?k=${encodeURIComponent(prod.name)}` : `https://www.amazon.com/s?k=${encodeURIComponent(prod.name)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 hover:text-[#FF9900] transition-all"
                        >
                          Verify on Amazon {region === "UK" ? "UK" : "US"}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {aiNiches.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-12 border-t border-ink/5"
              >
                {aiNiches.map((niche, idx) => (
                  <motion.div
                    key={niche.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="editorial-card p-5 bg-page-bg border-none hover:bg-brand-orange/5 transition-colors group relative"
                  >
                    <div className="absolute top-4 right-4 flex flex-col items-center justify-center w-12 h-12 bg-white border-2 border-brand-orange text-brand-orange rounded-full shadow-lg shadow-brand-orange/10">
                      <span className="font-mono font-black text-sm leading-none">{niche.opportunityScore}</span>
                      <span className="text-[6px] font-black uppercase tracking-[0.05em] mt-0.5">Index</span>
                    </div>
                    <span className="editorial-label !text-brand-orange group-hover:opacity-100 mb-2 block">{niche.category}</span>
                    <h4 className="text-lg font-serif italic leading-tight mb-2 pr-12">{niche.name}</h4>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest opacity-40">
                        <span>Demand</span>
                        <span>{niche.breakdown?.demand}%</span>
                      </div>
                      <div className="h-0.5 bg-ink/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${niche.breakdown?.demand}%` }} className="h-full bg-emerald-500" />
                      </div>
                      <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest opacity-40">
                        <span>Competition</span>
                        <span>{niche.breakdown?.competition}%</span>
                      </div>
                      <div className="h-0.5 bg-ink/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${niche.breakdown?.competition}%` }} className="h-full bg-amber-500" />
                      </div>
                      <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest opacity-40">
                        <span>Growth</span>
                        <span>{niche.breakdown?.growth}%</span>
                      </div>
                      <div className="h-0.5 bg-ink/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${niche.breakdown?.growth}%` }} className="h-full bg-brand-orange" />
                      </div>
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-60 mb-4 line-clamp-2">{niche.reason}</p>
                    <div className="mt-auto pt-4 border-t border-ink/5 flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{niche.estimatedDifficulty}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold text-brand-orange">{niche.potentialRevenue}</span>
                        <button 
                          onClick={() => saveNicheManual(niche)}
                          className={cn(
                            "p-1.5 rounded-full transition-all hover:bg-ink hover:text-white",
                            savedNiches.find(s => s.name === niche.name) ? "text-brand-orange bg-brand-orange/5" : "opacity-20"
                          )}
                        >
                          <Star className="w-3 h-3 fill-current" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center justify-between gap-8 py-4 border-y border-ink/10">
        <div className="flex items-center gap-4 flex-1">
          <Search className="h-4 w-4 opacity-30" />
          <input 
            type="text" 
            placeholder="Search Global Database..." 
            className="bg-transparent border-none outline-none text-xl font-serif italic w-full text-ink placeholder:opacity-20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 border-l border-ink/10 pl-8 hidden lg:flex">
          <Globe className="h-3.5 w-3.5 opacity-30" />
          <div className="flex gap-1 p-1 bg-page-bg border border-ink/5 rounded-full">
            {["Global", "UK"].map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={cn(
                  "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all",
                  region === r ? "bg-ink text-white" : "opacity-40 hover:opacity-100"
                )}
              >
                {r === "Global" ? "US/Global" : "UK Market"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="editorial-card shadow-2xl shadow-ink/5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-ink/10">
            <thead className="bg-ink/[0.02]">
              <tr>
                <th className="px-8 py-5 text-left text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Asset Index</th>
                <th className="px-8 py-5 text-left text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Demand</th>
                <th className="px-8 py-5 text-left text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Competition</th>
                <th className="px-8 py-5 text-left text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Opportunity Index</th>
                <th className="px-8 py-5 text-left text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Velocity</th>
                <th className="px-8 py-5 text-left text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Projection</th>
                <th className="px-8 py-5 text-right text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Options</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-ink/5">
              {filteredMockNiches.map((niche, idx) => (
                <motion.tr 
                  key={niche.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-brand-orange/[0.03] transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 bg-page-bg border border-ink/5 rounded overflow-hidden flex items-center justify-center p-2 group-hover:border-brand-orange/30 transition-all">
                        <ShoppingBag className="h-full w-full opacity-20 group-hover:text-brand-orange group-hover:opacity-100 transition-all" />
                      </div>
                      <div className="ml-5">
                        <div className="text-base font-serif italic text-ink">{niche.name}</div>
                        <div className="editorial-label !text-[9px] !opacity-30">Home & Kitchen Archetype</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      niche.demand.includes("Very High") ? "text-brand-orange" : "opacity-60"
                    )}>
                      {niche.demand}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                     <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          niche.competition === "Low" ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" : 
                          niche.competition === "Medium" ? "bg-amber-500" : "bg-rose-500"
                        )} />
                        <span className="text-[10px] font-bold uppercase opacity-60">{niche.competition}</span>
                     </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-6">
                      <div className="relative group/score">
                        <span className="text-4xl font-serif italic tracking-tighter text-ink leading-none">{niche.score}</span>
                        <div className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-brand-orange" />
                      </div>
                      <div className="flex flex-col gap-1.5 w-32">
                        <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest opacity-30">
                          <span>Mix Index</span>
                          <span>D/C/G</span>
                        </div>
                        <div className="flex gap-1 h-3 items-end">
                           <div className="flex-1 bg-emerald-500/20 rounded-t-sm relative">
                             <motion.div initial={{ height: 0 }} animate={{ height: `${niche.breakdown?.demand}%` }} className="absolute bottom-0 inset-x-0 bg-emerald-500 rounded-t-sm" />
                           </div>
                           <div className="flex-1 bg-amber-500/20 rounded-t-sm relative">
                             <motion.div initial={{ height: 0 }} animate={{ height: `${niche.breakdown?.competition}%` }} className="absolute bottom-0 inset-x-0 bg-amber-500 rounded-t-sm" />
                           </div>
                           <div className="flex-1 bg-brand-orange/20 rounded-t-sm relative">
                             <motion.div initial={{ height: 0 }} animate={{ height: `${niche.breakdown?.growth}%` }} className="absolute bottom-0 inset-x-0 bg-brand-orange rounded-t-sm" />
                           </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center text-xs font-mono font-bold text-emerald-600">
                      {niche.growth}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-xs font-mono font-bold text-ink">
                    {niche.revenue}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          saveNicheManual({
                            name: niche.name,
                            category: "Home & Kitchen",
                            reason: "Consistently high demand with stable growth metrics.",
                            estimatedDifficulty: niche.competition === "Low" ? "Low" : niche.competition === "Medium" ? "Medium" : "High",
                            potentialRevenue: niche.revenue,
                            opportunityScore: niche.score
                          });
                        }}
                        className={cn(
                          "p-2 border border-ink/10 rounded-full transition-all hover:bg-ink hover:text-white",
                          savedNiches.find(s => s.name === niche.name) ? "bg-brand-orange text-white border-brand-orange" : ""
                        )}
                      >
                        <Star className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Full report for ${niche.name} is being generated under account tokens.`);
                        }}
                        className="p-2 border border-ink/10 rounded-full hover:bg-ink hover:text-white transition-all"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-ink/[0.01] px-10 py-6 flex items-center justify-between border-t border-ink/5">
          <p className="editorial-label !opacity-30">Displaying {filteredMockNiches.length} indices of 1,244 total market archetypes</p>
          <div className="flex gap-4">
            <button 
              onClick={() => alert("Pagination restricted to Pro subscribers.")}
              className="editorial-label border border-ink/10 px-4 py-2 rounded hover:bg-ink hover:text-white transition-all"
            >
              Backward
            </button>
            <button 
              onClick={() => alert("Scanning next block of global indices...")}
              className="editorial-label border border-ink/10 px-4 py-2 rounded hover:bg-ink hover:text-white transition-all"
            >
              Forward
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isParamsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
              onClick={() => setIsParamsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md p-10 rounded-2xl shadow-2xl space-y-8"
            >
              <div>
                <h3 className="text-3xl font-serif italic">Discovery Parameters</h3>
                <p className="editorial-label !opacity-40">Refine neural search constraints</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="editorial-label">Minimum Opportunity Score</label>
                    <span className="text-xs font-mono font-bold text-brand-orange">{minScore}</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={minScore} 
                    onChange={(e) => setMinScore(parseInt(e.target.value))}
                    className="w-full accent-brand-orange"
                  />
                </div>
                <div className="space-y-3">
                  <label className="editorial-label">Market Velocity Threshold</label>
                  <select className="w-full bg-page-bg border border-ink/10 rounded-sm p-3 text-xs font-black tracking-widest uppercase">
                    <option>Aggressive (+15%)</option>
                    <option>Standard (+5%)</option>
                    <option>Deep-Value (Stable)</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={() => setIsParamsModalOpen(false)}
                className="w-full bg-ink text-white py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-orange transition-all"
              >
                Apply Constraints
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {savedNiches.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-end justify-between border-b border-ink/10 pb-4">
            <div>
              <h3 className="text-3xl font-serif italic">Saved Discovery Ledger</h3>
              <p className="editorial-label !opacity-40">Persistence layer for high-potential archetypes</p>
            </div>
            <button 
              onClick={clearSaved}
              className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 px-3 py-1 rounded transition-colors"
            >
              Purge Ledger
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedNiches.map((niche, idx) => (
              <motion.div
                key={niche.name + 'saved'}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="editorial-card p-6 bg-white border border-ink/5 relative group hover:border-brand-orange/30 transition-all"
              >
                <span className="editorial-label !text-brand-orange mb-2 block">{niche.category}</span>
                <h4 className="text-xl font-serif italic leading-tight mb-2">{niche.name}</h4>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 h-1 bg-ink/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${niche.opportunityScore}%` }}
                      className={cn(
                        "h-full transition-all",
                        niche.opportunityScore > 80 ? "bg-emerald-500" : niche.opportunityScore > 60 ? "bg-brand-orange" : "bg-ink/20"
                      )}
                    />
                  </div>
                  <span className="text-[9px] font-mono font-bold opacity-40">{niche.opportunityScore}</span>
                </div>
                <p className="text-xs leading-relaxed opacity-50 mb-6 line-clamp-2">{niche.reason}</p>
                <div className="flex items-center justify-between pt-4 border-t border-ink/5 mt-auto">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{niche.estimatedDifficulty}</span>
                  <span className="text-[10px] font-mono font-bold text-ink">{niche.potentialRevenue}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Verified Protocols', desc: 'Indices synchronized via real-time ERP nodes every 360 minutes.', icon: ShieldCheck },
          { title: 'Market Sentiment', desc: 'Predictive modeling identifies surges in Continental sub-sectors.', icon: TrendingUp },
          { title: 'Opportunity Formula', desc: 'Score = (Demand × 0.4) + (Competition × 0.3) + (Growth × 0.3). Best for scores > 82.', icon: HelpCircle },
        ].map((item) => (
          <div key={item.title} className="p-8 border border-ink/5 rounded-xl hover:bg-white hover:shadow-xl hover:shadow-ink/5 transition-all group">
            <div className="bg-ink text-white w-10 h-10 flex items-center justify-center rounded-sm mb-6 group-hover:bg-brand-orange transition-colors">
              <item.icon className="h-5 w-5" />
            </div>
            <h4 className="text-xl font-serif italic mb-2">{item.title}</h4>
            <p className="text-xs leading-relaxed opacity-50 font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
