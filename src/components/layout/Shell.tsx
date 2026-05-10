import { 
  LayoutDashboard, 
  Search, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Bell,
  User,
  Box,
  ShoppingBag
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Niche Finder', href: '/niche-finder', icon: Search },
  { name: 'Product Database', href: '/product-database', icon: Box },
  { name: 'Sourcing Center', href: '/sourcing', icon: ShoppingBag },
  { name: 'Market Trends', href: '/market-trends', icon: TrendingUp },
  { name: 'Competitor Analysis', href: '/competitor-analysis', icon: Users },
  { name: 'Sales Tracker', href: '/sales-tracker', icon: BarChart3 },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-page-bg font-sans">
      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-ink bg-opacity-75 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-ink text-white shadow-xl md:hidden"
            >
              <div className="flex h-20 items-center justify-between px-6 border-b border-white/10">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tighter">NICHE<span className="text-brand-orange">NAV</span></span>
                  <p className="editorial-label !text-white/40 mt-1">Market Intelligence</p>
                </div>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="h-6 w-6 text-white/50" />
                </button>
              </div>
              <nav className="mt-8 px-6 space-y-6">
                <div>
                  <p className="editorial-label !text-white/30 mb-4">Discovery</p>
                  <ul className="space-y-3">
                    {navigation.slice(0, 3).map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            className={cn(
                              "flex items-center gap-2 text-sm font-medium transition-all",
                              isActive ? "text-brand-orange" : "text-white/60 hover:text-white"
                            )}
                            onClick={() => setSidebarOpen(false)}
                          >
                            {isActive && <div className="w-1 h-1 bg-brand-orange rounded-full" />}
                            {item.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-ink text-white">
          <div className="flex h-20 items-center flex-shrink-0 px-8">
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tighter">NICHE<span className="text-brand-orange">NAV</span></span>
              <p className="editorial-label !text-white/40 mt-1">Market Intelligence</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto pt-8">
            <nav className="px-8 space-y-10">
              <div>
                <p className="editorial-label !text-white/30 mb-4">Discovery</p>
                <ul className="space-y-4">
                  {navigation.slice(0, 2).map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={cn(
                            "flex items-center gap-3 text-sm font-medium transition-all group",
                            isActive ? "text-brand-orange" : "text-white/50 hover:text-white"
                          )}
                        >
                          <div className={cn(
                            "w-1 h-1 rounded-full transition-all",
                            isActive ? "bg-brand-orange scale-125" : "bg-transparent group-hover:bg-white/20"
                          )} />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              
              <div>
                <p className="editorial-label !text-white/30 mb-4">Analysis</p>
                <ul className="space-y-4">
                  {navigation.slice(0, 3).map((item) => (
                    <li key={item.name + 'nav'}>
                       {/* This is just for variety like in design HTML */}
                    </li>
                  ))}
                  {navigation.slice(2).map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={cn(
                            "flex items-center gap-3 text-sm font-medium transition-all group",
                            isActive ? "text-brand-orange" : "text-white/50 hover:text-white"
                          )}
                        >
                          <div className={cn(
                            "w-1 h-1 rounded-full transition-all",
                            isActive ? "bg-brand-orange scale-125" : "bg-transparent group-hover:bg-white/20"
                          )} />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-white/10 p-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-orange to-orange-400 p-0.5 shadow-lg shadow-brand-orange/20 overflow-hidden">
                <div className="w-full h-full rounded-full bg-ink flex items-center justify-center">
                  <User className="h-5 w-5 text-brand-orange" />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold">Alex Rivers</p>
                <p className="editorial-label !text-white/40 !tracking-tight">Pro Explorer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-10 flex h-20 flex-shrink-0 bg-white border-b border-ink/10 items-center justify-between px-10">
          <button
            type="button"
            className="p-2 -ml-2 text-ink focus:outline-none md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 items-center max-w-xl mx-8">
            <div className="flex items-center gap-3 bg-[#F2F2F1] px-5 py-2.5 rounded-full w-full border border-transparent focus-within:border-ink/10 transition-all">
              <Search className="h-4 w-4 text-ink/40" />
              <input
                className="bg-transparent border-none outline-none text-sm w-full text-ink placeholder:text-ink/30"
                placeholder="Search ASIN, Keyword or Category..."
                type="search"
              />
            </div>
          </div>

          <div className="flex gap-8 items-center">
            <div className="text-right hidden sm:block">
              <p className="editorial-label !tracking-tighter">Market Status</p>
              <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5 animate-pulse" />
                Bullish High
              </p>
            </div>
            <button className="bg-ink text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-ink/90 transition-all active:scale-95 shadow-lg shadow-ink/10">
              Export Data
            </button>
          </div>
        </header>

        <main className="flex-1 p-10 max-w-[1400px]">
          {children}
        </main>
      </div>
    </div>
  );
}
