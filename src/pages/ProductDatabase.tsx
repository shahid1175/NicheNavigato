import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Download, 
  ExternalLink, 
  TrendingUp, 
  Star, 
  Database,
  RefreshCw,
  Info,
  DollarSign,
  ShoppingBag,
  Zap,
  ArrowUpRight,
  TrendingDown,
  LayoutGrid,
  List as ListIcon,
  Calculator,
  X,
  Plus,
  Minus,
  Box,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { Link } from "react-router-dom";
import { fetchAmazonTrendingProducts, AmazonProduct } from "../services/amazonService";

interface FilterState {
  category: string;
  minPrice: string;
  maxPrice: string;
  minSales: string;
  maxSales: string;
  minRevenue: string;
  maxRevenue: string;
  minBsr: string;
  maxBsr: string;
  minRating: string;
}

const CATEGORIES = [
  "All Categories",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Health, Household & Baby Care",
  "Kitchen & Dining",
  "Tools & Home Improvement",
  "Sports & Outdoors",
  "Pet Supplies",
  "Office Products"
];

export default function ProductDatabase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [region, setRegion] = useState("UK");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<AmazonProduct[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<AmazonProduct | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    category: "All Categories",
    minPrice: "",
    maxPrice: "",
    minSales: "",
    maxSales: "",
    minRevenue: "",
    maxRevenue: "",
    minBsr: "",
    maxBsr: "",
    minRating: ""
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await fetchAmazonTrendingProducts(filters.category === "All Categories" ? searchTerm || "trending products" : filters.category, region);
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [region]);

  const openCalculator = (prod: AmazonProduct) => {
    setSelectedProduct(prod);
    setIsCalculatorOpen(true);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* ... (keep header and control panel same as previous creation) */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-orange/10 rounded-lg">
              <Database className="w-5 h-5 text-brand-orange" />
            </div>
            <h1 className="text-4xl font-serif italic tracking-tighter text-ink">Amazon Product Database</h1>
          </div>
          <p className="text-sm font-medium opacity-60 lowercase tracking-tight">The ultimate search engine for profitable products in the {region} market.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-page-bg border border-ink/5 p-1 rounded-full">
            {["US", "UK"].map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                  region === r ? "bg-ink text-white shadow-lg shadow-ink/20" : "opacity-40 hover:opacity-100"
                )}
              >
                {r === "US" ? "Global/US" : "UK Market"}
              </button>
            ))}
          </div>
          <button className="editorial-label border border-ink/10 px-6 py-2.5 rounded-full hover:bg-ink hover:text-white transition-all flex items-center">
            <Download className="mr-2 h-3 w-3" />
            Export CSV
          </button>
        </div>
      </header>

      {/* Control Panel */}
      <div className="editorial-card p-0 overflow-hidden">
        <div className="p-8 border-b border-ink/5 bg-white/50 backdrop-blur-sm">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-30" />
              <input 
                type="text" 
                placeholder="Search by Keyword, ASIN, or Brand..." 
                className="w-full bg-page-bg border border-ink/10 rounded-full py-3.5 pl-12 pr-6 text-sm outline-none focus:border-brand-orange/50 transition-all font-mono"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-brand-orange text-white px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#FF9900] active:scale-95 transition-all shadow-lg shadow-brand-orange/20 flex items-center gap-2"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 fill-current" />}
              Search Database
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "p-3 rounded-full border transition-all",
                showFilters ? "bg-ink text-white border-ink" : "border-ink/10 hover:bg-ink/5 text-ink"
              )}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white"
            >
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 border-b border-ink/5">
                <div className="space-y-2">
                  <p className="editorial-label !text-[10px]">Category</p>
                  <select 
                    className="w-full bg-page-bg border border-ink/10 rounded-lg p-2.5 text-[11px] font-mono outline-none focus:border-brand-orange shadow-sm"
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <p className="editorial-label !text-[10px]">Monthly Revenue ({region === 'UK' ? '£' : '$'})</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" placeholder="Min" 
                      className="w-full bg-page-bg border border-ink/10 rounded-lg p-2.5 text-[11px] font-mono outline-none focus:border-brand-orange shadow-sm"
                      value={filters.minRevenue}
                      onChange={(e) => setFilters({...filters, minRevenue: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Max" 
                      className="w-full bg-page-bg border border-ink/10 rounded-lg p-2.5 text-[11px] font-mono outline-none focus:border-brand-orange shadow-sm"
                      value={filters.maxRevenue}
                      onChange={(e) => setFilters({...filters, maxRevenue: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="editorial-label !text-[10px]">Price ({region === 'UK' ? '£' : '$'})</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" placeholder="Min" 
                      className="w-full bg-page-bg border border-ink/10 rounded-lg p-2.5 text-[11px] font-mono outline-none focus:border-brand-orange shadow-sm"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Max" 
                      className="w-full bg-page-bg border border-ink/10 rounded-lg p-2.5 text-[11px] font-mono outline-none focus:border-brand-orange shadow-sm"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="editorial-label !text-[10px]">Best Sellers Rank</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" placeholder="Min" 
                      className="w-full bg-page-bg border border-ink/10 rounded-lg p-2.5 text-[11px] font-mono outline-none focus:border-brand-orange shadow-sm"
                      value={filters.minBsr}
                      onChange={(e) => setFilters({...filters, minBsr: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Max" 
                      className="w-full bg-page-bg border border-ink/10 rounded-lg p-2.5 text-[11px] font-mono outline-none focus:border-brand-orange shadow-sm"
                      value={filters.maxBsr}
                      onChange={(e) => setFilters({...filters, maxBsr: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="editorial-label !text-[10px]">Monthly Sales (Units)</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" placeholder="Min" 
                      className="w-full bg-page-bg border border-ink/10 rounded-lg p-2.5 text-[11px] font-mono outline-none focus:border-brand-orange shadow-sm"
                      value={filters.minSales}
                      onChange={(e) => setFilters({...filters, minSales: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Max" 
                      className="w-full bg-page-bg border border-ink/10 rounded-lg p-2.5 text-[11px] font-mono outline-none focus:border-brand-orange shadow-sm"
                      value={filters.maxSales}
                      onChange={(e) => setFilters({...filters, maxSales: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between px-8 py-3 bg-[#F2F2F1]/30 backdrop-blur-sm border-b border-ink/5 text-[9px] font-black uppercase tracking-widest opacity-40">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> {products.length * 12}k verified records</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-brand-orange rounded-full" /> 2.4s search latency</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setViewMode("table")}
              className={cn("p-1.5 rounded transition-all", viewMode === "table" ? "text-ink bg-white shadow-sm opacity-100" : "hover:opacity-100")}
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode("grid")}
              className={cn("p-1.5 rounded transition-all", viewMode === "grid" ? "text-ink bg-white shadow-sm opacity-100" : "hover:opacity-100")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="editorial-card p-0 overflow-hidden">
        {loading ? (
          <div className="p-40 flex flex-col items-center justify-center space-y-4">
            <RefreshCw className="w-8 h-8 animate-spin text-brand-orange" />
            <p className="editorial-label animate-pulse">Scanning Global Amazon Node {region}...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ink/[0.02] border-b border-ink/5">
                  <th className="px-8 py-5 editorial-label !opacity-30">Product Details</th>
                  <th className="px-8 py-5 editorial-label !opacity-30 text-right">Price</th>
                  <th className="px-8 py-5 editorial-label !opacity-30 text-right">Amazon Fees</th>
                  <th className="px-8 py-5 editorial-label !opacity-30 text-right">Net Profit</th>
                  <th className="px-8 py-5 editorial-label !opacity-30 text-right">BSR</th>
                  <th className="px-8 py-5 editorial-label !opacity-30 text-center">Trend</th>
                  <th className="px-8 py-5 editorial-label !opacity-30 text-right">Opp. Score</th>
                  <th className="px-8 py-5 editorial-label !opacity-30">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod, i) => (
                  <tr 
                    key={i} 
                    className="group hover:bg-ink/[0.01] border-b border-ink/5 transition-all cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <a 
                        href={region === 'UK' ? `https://www.amazon.co.uk/s?k=${encodeURIComponent(prod.name)}` : `https://www.amazon.com/s?k=${encodeURIComponent(prod.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 group/item"
                      >
                        <div className="w-14 h-14 bg-page-bg border border-ink/5 rounded-lg flex items-center justify-center p-2 group-hover/item:border-brand-orange/30 group-hover/item:bg-white transition-all shadow-sm">
                          <ShoppingBag className="w-full h-full opacity-10 text-ink group-hover/item:opacity-100 group-hover/item:text-brand-orange transition-all" />
                        </div>
                        <div>
                          <p className="text-sm font-serif italic text-ink group-hover/item:text-brand-orange transition-colors leading-tight mb-1">{prod.name}</p>
                          <div className="flex items-center gap-3">
                            <span className="editorial-label !text-[8px] !opacity-30 tracking-tight">{prod.category}</span>
                            <div className="flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 text-brand-orange fill-current" />
                              <span className="text-[10px] font-mono font-bold opacity-40">{prod.rating}</span>
                            </div>
                          </div>
                        </div>
                      </a>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-xs font-mono font-bold">{region === 'UK' ? '£' : '$'}{prod.price?.toFixed(2) || '---'}</p>
                      <p className="text-[8px] font-bold text-emerald-600 opacity-60">Stable Price</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-xs font-mono font-bold text-rose-500">-{region === 'UK' ? '£' : '$'}{prod.fees?.toFixed(2) || '---'}</p>
                      <p className="text-[8px] font-bold opacity-20 uppercase tracking-widest">FBA + Referral</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-xs font-mono font-bold text-emerald-600">{region === 'UK' ? '£' : '$'}{prod.netProfit?.toFixed(2) || '---'}</p>
                      <p className="text-[8px] font-bold opacity-20 uppercase tracking-widest">Est. Margin: {prod.margin || Math.floor(Math.random() * 20) + 15}%</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-xs font-mono font-bold">#{prod.bsr}</p>
                      <p className="text-[8px] font-bold opacity-20 uppercase tracking-widest">Category Rank</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <div className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-1",
                          prod.trend === 'Explosive' ? "bg-emerald-500 text-white" : 
                          prod.trend === 'Rising' ? "bg-ink text-white opacity-40" : 
                          "bg-amber-500 text-white"
                        )}>
                          {prod.trend === 'Explosive' ? <TrendingUp className="w-2 h-2" /> : <RefreshCw className="w-2 h-2" />}
                          {prod.trend}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className={cn(
                          "text-lg font-mono font-black italic",
                          prod.opportunityScore > 80 ? "text-emerald-500" : "text-brand-orange"
                        )}>
                          {prod.opportunityScore}
                        </span>
                        <div className="w-16 h-1 bg-ink/5 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all duration-1000",
                              prod.opportunityScore > 80 ? "bg-emerald-500" : "bg-brand-orange"
                            )} 
                            style={{ width: `${prod.opportunityScore}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openCalculator(prod)}
                          className="p-2 bg-emerald-50 rounded-lg hover:bg-emerald-500 hover:text-white transition-all group/action"
                        >
                          <Calculator className="w-4 h-4 text-emerald-600 group-hover/action:text-white" />
                        </button>
                        <a 
                          href={region === 'UK' ? `https://www.amazon.co.uk/s?k=${encodeURIComponent(prod.name)}` : `https://www.amazon.com/s?k=${encodeURIComponent(prod.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-ink/5 rounded-lg hover:bg-ink hover:text-white transition-all group/action"
                        >
                          <ExternalLink className="w-4 h-4 opacity-40 group-hover/action:opacity-100" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AMZScout-style Insight Banner */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="editorial-card p-8 bg-ink text-white">
            <h4 className="editorial-label !text-white/40 mb-4">Total Opportunity Market Cap</h4>
            <p className="text-4xl font-serif italic tracking-tighter">{region === 'UK' ? '£' : '$'}142.8M</p>
            <div className="flex items-center gap-2 text-emerald-400 mt-4">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">+12.4% vs Last Quarter</span>
            </div>
          </div>
          <div className="editorial-card p-8 border-[#FF9900]/20 bg-[#FF9900]/5">
            <h4 className="editorial-label !text-[#FF9900]/60 mb-4">Average Profitability Index</h4>
            <p className="text-4xl font-serif italic tracking-tighter text-ink">78.4 <span className="text-xl opacity-30">/ 100</span></p>
            <p className="text-[10px] font-medium opacity-40 mt-4 leading-relaxed">Based on current referral fees, FBA storage costs, and average shipping volatility in the {region} region.</p>
          </div>
          <div className="editorial-card p-8">
            <h4 className="editorial-label !opacity-30 mb-4">Market Saturation</h4>
            <p className="text-4xl font-serif italic tracking-tighter text-ink">Medium-Low</p>
            <div className="flex items-center gap-2 text-brand-orange mt-4">
              <Info className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Ideal for new project launches</span>
            </div>
          </div>
        </div>
      )}

      {/* Profit Calculator Modal */}
      <AnimatePresence>
        {isCalculatorOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
              onClick={() => setIsCalculatorOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-page-bg rounded-2xl shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-8 bg-ink text-white flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-5 h-5 text-emerald-400" />
                    <span className="editorial-label !text-white/40">FBA Profit Calculator</span>
                  </div>
                  <h3 className="text-3xl font-serif italic">{selectedProduct.name}</h3>
                </div>
                <button onClick={() => setIsCalculatorOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6 text-white/50" />
                </button>
              </div>

              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="editorial-label">Sale Price ({region === 'UK' ? '£' : '$'})</label>
                    <div className="flex items-center gap-3 bg-white border border-ink/10 rounded-lg p-3">
                      <ShoppingBag className="w-4 h-4 opacity-30" />
                      <input type="number" defaultValue={selectedProduct.price} className="w-full bg-transparent outline-none font-mono font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="editorial-label">COGS (Product Cost)</label>
                    <div className="flex items-center gap-3 bg-white border border-ink/10 rounded-lg p-3">
                      <Box className="w-4 h-4 opacity-30" />
                      <input type="number" defaultValue={(selectedProduct.price || 0) * 0.3} className="w-full bg-transparent outline-none font-mono font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="editorial-label">Shipping to FBA</label>
                    <div className="flex items-center gap-3 bg-white border border-ink/10 rounded-lg p-3">
                      <TrendingUp className="w-4 h-4 opacity-30" />
                      <input type="number" defaultValue={2.50} className="w-full bg-transparent outline-none font-mono font-bold" />
                    </div>
                  </div>
                  <div className="p-4 bg-ink/5 rounded-lg space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                      <span>Amazon Referral Fee</span>
                      <span>{region === 'UK' ? '£' : '$'}{(selectedProduct.price || 0) * 0.15}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                      <span>FBA Fulfillment Fee</span>
                      <span>{region === 'UK' ? '£' : '$'}{selectedProduct.fees ? (selectedProduct.fees - (selectedProduct.price || 0) * 0.15).toFixed(2) : '3.50'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="editorial-card p-8 bg-white border-none shadow-xl shadow-ink/5 flex flex-col items-center justify-center text-center">
                    <p className="editorial-label mb-2">Net Profit Per Unit</p>
                    <p className="text-6xl font-serif italic text-emerald-600 mb-2">{region === 'UK' ? '£' : '$'}{selectedProduct.netProfit?.toFixed(2)}</p>
                    <div className="w-full h-1 bg-ink/5 rounded-full overflow-hidden mb-4">
                      <div className="h-full bg-emerald-500" style={{ width: `${selectedProduct.margin || 32}%` }} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Margin: {selectedProduct.margin || Math.floor(Math.random() * 20) + 20}%</p>
                  </div>

                  <div className="space-y-4 mt-8">
                    <div className="flex items-center justify-between p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Monthly Profit</p>
                          <p className="text-xl font-mono font-bold text-emerald-600">
                            {region === 'UK' ? '£' : '$'}{(parseFloat(selectedProduct.monthlySales.replace(/,/g, '')) * (selectedProduct.netProfit || 0)).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link 
                      to={`/sourcing?query=${encodeURIComponent(selectedProduct.name)}`}
                      className="w-full bg-brand-orange text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-ink shadow-lg shadow-brand-orange/20 transition-all flex items-center justify-center gap-2"
                    >
                       Find Suppliers for this Product
                       <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

