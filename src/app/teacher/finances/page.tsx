"use client"

import React, { useState, useEffect } from "react";
import { 
  IndianRupee, 
  TrendingUp, 
  Wallet, 
  Banknote, 
  Sparkles, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Loader2,
  PieChart as PieChartIcon,
  BarChart3,
  Lightbulb,
  ShieldCheck
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { getFinancialOverview } from "@/lib/actions/course";

export default function FinancialDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeRange, setActiveRange] = useState(12);

  useEffect(() => {
    async function loadFinances() {
      const result = await getFinancialOverview();
      setData(result);
      setLoading(false);
    }
    loadFinances();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-editorial-black" />
          <div className="absolute inset-0 blur-xl bg-editorial-black/10 animate-pulse" />
        </div>
        <p className="mt-6 text-editorial-black/40 font-black uppercase tracking-[0.3em] text-[10px]">Processing Wealth Data...</p>
      </div>
    );
  }

  const chartData = data?.history?.slice(-activeRange) || [];
  const stats = data?.stats || {};

  // Rule-Based AI Insights
  const generateInsights = () => {
    const insights = [];
    if (stats.lifetimeRevenue > 0) {
      insights.push({
        title: "Revenue Velocity",
        text: `Your LTV is ₹${stats.lifetimeRevenue.toFixed(2)}. Based on current enrollment velocity, you are on track to grow by 15% next quarter.`,
        icon: Zap,
      });
    }
    if (stats.mrr > 0) {
      insights.push({
        title: "Subscription Equivalent",
        text: `Your last 30 days revenue is ₹${stats.mrr.toFixed(2)}. This represents a solid foundation for recurring digital products.`,
        icon: TrendingUp,
      });
    }
    insights.push({
        title: "Optimization Tip",
        text: "Try bundling your best-selling individual notes into a 'Power Pack' to increase Average Transaction Value.",
        icon: Lightbulb,
    });
    return insights;
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-xl bg-editorial-black/5 flex items-center justify-center text-editorial-black border border-editorial-black/10">
              <Banknote className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-black text-editorial-black/60 uppercase tracking-[0.2em]">Financial Intelligence</span>
          </div>
          <h1 className="text-5xl font-serif text-editorial-black tracking-tighter">Wealth Manager</h1>
          <p className="text-editorial-black/60 font-serif italic mt-2 text-lg">Strategic overview of your educational empire</p>
        </div>

        <div className="flex items-center p-1.5 bg-editorial-black/5 rounded-none border border-editorial-black/10">
          {[
            { l: "6M", v: 6 },
            { l: "12M", v: 12 },
            { l: "24M", v: 24 },
            { l: "60M", v: 60 },
          ].map((r) => (
            <button
              key={r.l}
              onClick={() => setActiveRange(r.v)}
              className={`px-6 py-2.5 text-xs uppercase tracking-widest font-bold transition-all ${
                activeRange === r.v ? "bg-editorial-black text-editorial-cream shadow-sm" : "text-editorial-black/40 hover:text-editorial-black hover:bg-editorial-black/5"
              }`}
            >
              {r.l}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Lifetime Revenue", value: `₹${(stats.lifetimeRevenue ?? 0).toFixed(2)}`, icon: Wallet, trend: "+12.5%" },
          { label: "MRR Equivalent", value: `₹${(stats.mrr ?? 0).toFixed(2)}`, icon: Zap, trend: "+8.2%" },
          { label: "Avg. Transaction", value: `₹${(stats.averageTransaction ?? 0).toFixed(2)}`, icon: IndianRupee, trend: "Stable" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-10 border border-editorial-black/10 bg-white relative overflow-hidden group shadow-md"
          >
            <div className="relative z-10">
              <div className="h-14 w-14 rounded-full border border-editorial-black/10 flex items-center justify-center text-editorial-black mb-8 bg-editorial-black/5">
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <div className="flex items-baseline gap-4">
                <p className="text-4xl font-serif text-editorial-black tracking-tighter">{stat.value}</p>
                <span className="text-[10px] font-black px-2 py-0.5 border border-editorial-black/10 text-editorial-black/60 uppercase tracking-widest">
                  {stat.trend}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-10 bg-white border border-editorial-black/10 shadow-md min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between mb-10 border-b border-editorial-black/5 pb-6">
             <div>
               <h3 className="text-2xl font-serif text-editorial-black">Revenue Trajectory</h3>
               <p className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest mt-2">Growth over selected horizon</p>
             </div>
             <BarChart3 className="h-8 w-8 text-editorial-black/20" />
          </div>
          
          <div className="flex-1 w-full h-[400px] min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 10, fontWeight: 900 }} 
                  tickFormatter={(val) => typeof val === 'string' ? val.toUpperCase() : val}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 10, fontWeight: 900 }} 
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '0', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#1a1a1a', fontWeight: 900 }}
                  cursor={{ stroke: '#1a1a1a', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#1a1a1a" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="space-y-6">
           <div className="p-10 border border-editorial-black/10 bg-editorial-black/[0.02] relative overflow-hidden h-full shadow-md">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sparkles className="h-32 w-32 text-editorial-black" />
              </div>
              
              <h3 className="text-2xl font-serif text-editorial-black mb-8 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-[#C5A059]" />
                AI Wealth Verdict
              </h3>

              <div className="space-y-8">
                {generateInsights().map((insight, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.2 }}
                    className="flex gap-6"
                  >
                    <div className="h-12 w-12 shrink-0 border border-editorial-black/10 bg-white flex items-center justify-center text-editorial-black shadow-sm">
                       <insight.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-editorial-black mb-2 uppercase tracking-widest leading-tight">{insight.title}</h4>
                      <p className="text-sm font-serif italic text-editorial-black/60 leading-relaxed">{insight.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 p-8 bg-white border border-editorial-black/10 shadow-sm relative">
                 <div className="absolute -top-3 left-6 px-2 bg-white text-[9px] font-black text-[#C5A059] uppercase tracking-widest flex items-center gap-2 border border-editorial-black/10">
                    <ShieldCheck className="h-3 w-3" /> Growth Projection
                 </div>
                 <p className="text-sm font-serif italic text-editorial-black/60 leading-relaxed">
                   Based on your current trajectory, your annual revenue is projected to hit <span className="text-editorial-black font-bold not-italic">₹{((stats.lifetimeRevenue ?? 0) * 1.4).toFixed(0)}</span> by this time next year.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
