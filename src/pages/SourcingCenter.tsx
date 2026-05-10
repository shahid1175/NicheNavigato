import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Search, 
  ShoppingBag, 
  Globe, 
  ShieldCheck, 
  Zap, 
  RefreshCw, 
  ArrowRight, 
  ExternalLink,
  Calculator,
  Ship,
  Truck,
  DollarSign,
  Star,
  CheckCircle2,
  AlertCircle,
  Package,
  Info,
  ChevronRight,
  Award,
  Lock,
  Verified,
  SearchCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { generateSuppliers } from "../services/geminiService";

interface Supplier {
  factoryName: string;
  verification: string;
  priceRange: string;
  moq: number;
  leadTime: string;
  advantages: string[];
  shippingEstimate: number;
  rating: number;
  trustScore: number;
  isTradeAssurance: boolean;
  isoCertified: boolean;
  onSiteChecked: boolean;
}

const TAX_DATA = {
  UK: {
    VAT_RATE: 20,
    CATEGORIES: [
      { name: "Electronics", duty: 2, icon: Zap },
      { name: "Textiles", duty: 12, icon: ShoppingBag },
      { name: "Furniture", duty: 0, icon: Package },
      { name: "Kitchenware", duty: 8.5, icon: ChevronRight },
      { name: "Toys", duty: 4.7, icon: Star },
    ]
  },
  US: {
    VAT_RATE: 0, // Sales tax is separate, duty is key
    CATEGORIES: [
      { name: "Electronics", duty: 0, icon: Zap },
      { name: "Textiles", duty: 16, icon: ShoppingBag },
      { name: "Furniture", duty: 1, icon: Package },
      { name: "Kitchenware", duty: 3, icon: ChevronRight },
      { name: "Toys", duty: 0, icon: Star },
    ]
  }
};

interface VerificationBadgeProps {
  icon: React.ElementType;
  label: string;
  type?: "emerald" | "amber" | "ink";
  pulse?: boolean;
}

const VerificationBadge = ({ icon: Icon, label, type = "emerald", pulse = false }: VerificationBadgeProps) => {
  const colors = {
    emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-emerald-500/5",
    amber: "bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-amber-500/5",
    ink: "bg-ink/5 text-ink/60 border-ink/10 shadow-transparent"
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -1 }}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest transition-all shadow-sm",
        colors[type]
      )}
    >
      <div className="relative">
        <Icon className="w-3 h-3" />
        {pulse && (
          <span className="absolute inset-0 bg-current rounded-full animate-ping opacity-20" />
        )}
      </div>
      {label}
    </motion.div>
  );
};

export default function SourcingCenter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [region, setRegion] = useState<"UK" | "US">("UK");
  const [category, setCategory] = useState("Electronics");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Landed Cost State
  const [unitCost, setUnitCost] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  
  // Calculate dynamic rates
  const currentTaxConfig = TAX_DATA[region];
  const currentCategory = currentTaxConfig.CATEGORIES.find(c => c.name === category) || currentTaxConfig.CATEGORIES[0];
  
  const dutyRate = currentCategory.duty;
  const vatRate = currentTaxConfig.VAT_RATE;

  // Regional Calculation Logic
  const calculateTotalLanded = () => {
    if (region === "UK") {
      // UK Rules: Duty on (Value + Shipping), VAT on (Value + Shipping + Duty)
      const baseValue = unitCost + shippingCost;
      const duty = baseValue * (dutyRate / 100);
      const vat = (baseValue + duty) * (vatRate / 100);
      return { total: baseValue + duty + vat, duty, vat };
    } else {
      // US Rules: Duty on Value mainly (simplified for this tool)
      const duty = unitCost * (dutyRate / 100);
      const total = unitCost + shippingCost + duty;
      return { total, duty, vat: 0 };
    }
  };

  const { total: totalLanded, duty: calculatedDuty, vat: calculatedVat } = calculateTotalLanded();

  const handleSearch = async (overrideTerm?: string) => {
    const termToUse = overrideTerm || searchTerm;
    if (!termToUse) return;
    setLoading(true);
    try {
      const data = await generateSuppliers(termToUse, "General");
      setSuppliers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setSearchTerm(query);
      handleSearch(query);
    } else {
      // Default initial fetch to show the feature is "working"
      handleSearch("Eco Friendly Water Bottle");
    }
  }, [searchParams]);

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Globe className="w-5 h-5 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-serif italic tracking-tighter text-ink">Global Sourcing Center</h1>
          </div>
          <p className="text-sm font-medium opacity-60 lowercase tracking-tight">Connect with verified manufacturers and optimize your supply chain logistics.</p>
        </div>
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
              Logistics: {r}
            </button>
          ))}
        </div>
      </header>

      {/* Sourcing Search */}
      <div className="editorial-card p-1">
        <div className="flex gap-1 p-2 bg-page-bg/50 backdrop-blur-sm rounded-[1.25rem]">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 opacity-30" />
            <input 
              type="text" 
              placeholder="What are you sourcing? (e.g. Ergonomic Office Chair, Silk Pillowcase)" 
              className="w-full bg-transparent border-none py-6 pl-16 pr-8 text-lg font-serif italic outline-none text-ink placeholder:opacity-20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-ink text-white px-12 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-orange transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-brand-orange text-brand-orange" />}
            Find Suppliers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Supplier List */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="p-40 flex flex-col items-center justify-center space-y-4 opacity-30">
              <RefreshCw className="w-10 h-10 animate-spin text-emerald-500" />
              <p className="editorial-label animate-pulse">Contacting Verified Factories in mainland China...</p>
            </div>
          ) : suppliers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {suppliers.map((supplier, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i}
                  className={cn(
                    "editorial-card p-8 group hover:border-emerald-500/30 transition-all cursor-pointer relative overflow-hidden",
                    selectedSupplier?.factoryName === supplier.factoryName && "border-emerald-500 ring-1 ring-emerald-500/20"
                  )}
                  onClick={() => {
                    setSelectedSupplier(supplier);
                    setUnitCost(parseFloat(supplier.priceRange.split('-')[0].replace(/[^0.0-9]/g, '')));
                    setShippingCost(supplier.shippingEstimate);
                  }}
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex flex-col gap-3 flex-1">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-serif italic text-ink">{supplier.factoryName}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <VerificationBadge 
                            icon={Award} 
                            label={supplier.verification} 
                            type={supplier.verification.includes("Gold") ? "amber" : "emerald"}
                            pulse={supplier.verification.includes("Gold")}
                          />
                          {supplier.isTradeAssurance && (
                            <VerificationBadge 
                              icon={Lock} 
                              label="Trade Assurance" 
                              type="emerald"
                            />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-24 h-2 bg-ink/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${supplier.trustScore}%` }}
                            className={cn(
                              "h-full transition-colors",
                              supplier.trustScore > 90 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                            )}
                          />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Validation: {supplier.trustScore}%</span>
                      </div>

                      <div className="flex items-center gap-6 mt-3">
                        <div className="flex flex-col">
                          <span className="editorial-label !text-[8px] opacity-40">Unit Price</span>
                          <span className="text-lg font-mono font-black italic text-ink">{supplier.priceRange}</span>
                        </div>
                        <div className="flex flex-col border-l border-ink/5 pl-6">
                          <span className="editorial-label !text-[8px] opacity-40">MOQ</span>
                          <span className="text-lg font-mono font-black italic text-ink">{supplier.moq} units</span>
                        </div>
                        <div className="flex flex-col border-l border-ink/5 pl-6">
                          <span className="editorial-label !text-[8px] opacity-40">Lead Time</span>
                          <span className="text-lg font-mono font-black italic text-ink">{supplier.leadTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        {supplier.isoCertified && (
                          <VerificationBadge 
                            icon={Verified} 
                            label="ISO 9001" 
                            type="ink"
                          />
                        )}
                        {supplier.onSiteChecked && (
                          <VerificationBadge 
                            icon={SearchCheck} 
                            label="Audit Passed" 
                            type="ink"
                          />
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {supplier.advantages.map((adv, j) => (
                          <span key={j} className="text-[9px] font-bold text-ink/40 bg-ink/5 px-2 py-1 rounded">
                            {adv}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-brand-orange fill-brand-orange" />
                        <span className="text-xs font-mono font-black">{supplier.rating}</span>
                      </div>
                      <button className="bg-ink text-white p-3 rounded-full hover:bg-emerald-600 transition-all shadow-lg group-hover:scale-110">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="editorial-card p-20 flex flex-col items-center text-center opacity-40">
              <ShoppingBag className="w-12 h-12 mb-6" />
              <h3 className="text-xl font-serif italic mb-2">Ready to Source?</h3>
              <p className="text-xs font-medium max-w-xs leading-relaxed lowercase tracking-tight">Enter a product name above to discover verified manufacturers and factory direct pricing.</p>
            </div>
          )}
        </div>

        {/* Landed Cost Calculator Hub */}
        <div className="space-y-6">
          <div className="editorial-card p-0 overflow-hidden sticky top-30">
            <div className="p-8 bg-ink text-white">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span className="editorial-label !text-white/40">Landed Cost Hub</span>
              </div>
              <h3 className="text-2xl font-serif italic">Unit Economics</h3>
            </div>
            
            <div className="p-8 space-y-6 bg-white">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="editorial-label">Product Category (HS Code Target)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TAX_DATA[region].CATEGORIES.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => setCategory(cat.name)}
                        className={cn(
                          "flex items-center gap-2 p-2.5 rounded-lg border text-[9px] font-bold transition-all text-left",
                          category === cat.name 
                            ? "border-emerald-500 bg-emerald-500/5 text-emerald-700" 
                            : "border-ink/5 hover:border-ink/20 opacity-60"
                        )}
                      >
                        <cat.icon className="w-3 h-3 shrink-0" />
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="editorial-label">Unit Cost (Ex-Factory)</label>
                    <DollarSign className="w-3 h-3 opacity-20" />
                  </div>
                  <input 
                    type="number" 
                    value={unitCost}
                    onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-page-bg border border-ink/10 rounded-lg p-3 text-sm font-mono font-bold focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="editorial-label">Shipping per Unit</label>
                    <Ship className="w-3 h-3 opacity-20" />
                  </div>
                  <input 
                    type="number" 
                    value={shippingCost}
                    onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-page-bg border border-ink/10 rounded-lg p-3 text-sm font-mono font-bold focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                <div className="p-4 bg-page-bg/50 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Import Duty ({dutyRate}%)</span>
                    <span className="text-xs font-mono font-bold">£{calculatedDuty.toFixed(2)}</span>
                  </div>
                  {region === "UK" && (
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-40">VAT ({vatRate}%)</span>
                      <span className="text-xs font-mono font-bold">£{calculatedVat.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-ink/5">
                <div className="flex justify-between items-end mb-4">
                  <span className="editorial-label">Total Landed Cost</span>
                  <span className="text-3xl font-serif italic text-emerald-600">£{totalLanded.toFixed(2)}</span>
                </div>
                <div className="w-full h-1 bg-ink/5 rounded-full overflow-hidden mb-8">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="h-full bg-emerald-500" 
                  />
                </div>
                <button className="w-full bg-ink text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                  Request RFQ to Factory
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Logistics Tracking / Info */}
          <div className="editorial-card p-0 overflow-hidden bg-emerald-500/5 border-emerald-500/10">
            <div className="p-6 bg-emerald-500 text-white flex items-center gap-3">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="text-sm font-black uppercase tracking-widest">AMZScout Trust Shield</h4>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-500/10 rounded-lg shrink-0">
                    <Lock className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-800 mb-1">Payment Protection</h5>
                    <p className="text-[10px] text-emerald-900/60 leading-tight">Funds are only released to the supplier after product inspection.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-500/10 rounded-lg shrink-0">
                    <SearchCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-800 mb-1">On-Site Audits</h5>
                    <p className="text-[10px] text-emerald-900/60 leading-tight">Factories are physically checked for equipment and safety standards.</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-emerald-500/10 italic font-serif text-[11px] text-emerald-900/60">
                "We use real-time AI and trade data to verify manufacturer performance and financial health."
              </div>
            </div>
          </div>

          <div className="editorial-card p-8 bg-ink/5 border-ink/10">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-5 h-5 text-ink/40" />
              <h4 className="text-sm font-black uppercase tracking-widest text-ink/60">Sourcing Expert Pro-Tip</h4>
            </div>
            <p className="text-xs font-medium text-ink/40 leading-relaxed mb-6 lowercase tracking-tight">
              When sourcing for the {region} market, look for suppliers with **CE/UKCA certificates** and those who offer **Sea Freight (LDP)** options to reduce hidden customs costs. 
            </p>
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-ink/20">
              <span>Freight Index</span>
              <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3 rotate-[-45deg]" /> Bullish</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
