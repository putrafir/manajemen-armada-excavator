"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Map, 
  TrendingUp, 
  Cpu,
  Hexagon
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Operations Overview", href: "/", icon: LayoutDashboard },
    { label: "Pit Stress Radar", href: "/fleet-map", icon: Map },
    { label: "Predictive Wear", href: "/analytics", icon: TrendingUp },
    { label: "Neural Diagnostics", href: "/diagnostics", icon: Cpu },
  ];

  return (
    <aside className="w-60 bg-white text-slate-700 flex flex-col justify-between h-screen sticky top-0 border-r border-slate-200 shrink-0 select-none z-30 font-sans shadow-xs">
      <div>
        {/* Brand Logo */}
        <div className="px-5 py-5 border-b border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#EA580C] to-[#C2410C] flex items-center justify-center shadow-md shadow-orange-500/20 text-white">
            <Hexagon className="w-4 h-4 fill-white/20 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-sm font-black tracking-wider text-slate-900 uppercase">
              TerraCortex
            </div>
            <div className="text-[9px] tracking-widest text-orange-600 uppercase font-mono font-bold">
              Operations Intelligence
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-6">
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">
            Console Navigation
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === "/diagnostics" && pathname === "/copilot");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-orange-600 text-white shadow-md shadow-orange-500/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Operator Status Footer */}
      <div className="p-3 m-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 font-mono">
        <div className="w-7 h-7 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-[11px] font-bold text-orange-700">
          VA
        </div>
        <div className="overflow-hidden">
          <div className="text-xs font-bold text-slate-800 truncate font-sans">Dr. V. Aris</div>
          <div className="text-[9px] text-slate-500 truncate flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Pit 4 Operations
          </div>
        </div>
      </div>
    </aside>
  );
}
