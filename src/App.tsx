/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Shell } from "./components/layout/Shell";
import Dashboard from "./pages/Dashboard";
import NicheFinder from "./pages/NicheFinder";
import MarketTrends from "./pages/MarketTrends";
import CompetitorAnalysis from "./pages/CompetitorAnalysis";
import SalesTracker from "./pages/SalesTracker";
import ProductDatabase from "./pages/ProductDatabase";
import SourcingCenter from "./pages/SourcingCenter";

export default function App() {
  return (
    <Router>
      <Shell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/niche-finder" element={<NicheFinder />} />
          <Route path="/product-database" element={<ProductDatabase />} />
          <Route path="/sourcing" element={<SourcingCenter />} />
          <Route path="/market-trends" element={<MarketTrends />} />
          <Route path="/competitor-analysis" element={<CompetitorAnalysis />} />
          <Route path="/sales-tracker" element={<SalesTracker />} />
        </Routes>
      </Shell>
    </Router>
  );
}



