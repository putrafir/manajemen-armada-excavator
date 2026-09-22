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
    <aside className="w-60 bg-[#0B111C] text-slate-300 flex flex-col justify-between h-screen sticky top-0 border-r border-white/5 shrink-0 select-none z-30 font-sans">
      <div>
        {/* Brand Logo */}
        <div className="px-5 py-5 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#EA580C] to-[#C2410C] flex items-center justify-center shadow-md shadow-orange-950/50 text-white">
            <Hexagon className="w-4 h-4 fill-white/20 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-sm font-black tracking-wider text-white uppercase">
              TerraCortex
            </div>
            <div className="text-[9px] tracking-widest text-orange-500 uppercase font-mono font-bold">
              Operations Intelligence
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-6">
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono">
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
                      ? "bg-orange-600 text-white shadow-md shadow-orange-950/40"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Operator Status Footer */}
      <div className="p-3 m-3 rounded-xl bg-[#0F1626] border border-white/5 flex items-center gap-3 font-mono">
        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px] font-bold text-orange-400">
          VA
        </div>
        <div className="overflow-hidden">
          <div className="text-xs font-bold text-slate-200 truncate font-sans">Dr. V. Aris</div>
          <div className="text-[9px] text-slate-500 truncate flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Pit 4 Operations
          </div>
        </div>
      </div>
    </aside>
  );
}
