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
    <aside className="w-64 bg-white text-slate-700 flex flex-col justify-between h-screen sticky top-0 border-r border-slate-200/70 shrink-0 select-none z-30 font-sans shadow-[1px_0_3px_0_rgba(0,0,0,0.02)]">
      <div>
        {/* Brand Logo */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm shadow-orange-500/20 text-white">
            <Hexagon className="w-4.5 h-4.5 fill-white/20 stroke-[2]" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-slate-900">
              TerraCortex
            </div>
            <div className="text-[10px] tracking-wide text-orange-600 font-semibold uppercase">
              Operations Intelligence
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3.5 py-5">
          <div className="px-3 mb-2.5 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            Menu
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all ${
                    isActive
                      ? "bg-orange-50/90 text-orange-700 font-semibold border border-orange-200/60 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 stroke-[1.75] ${isActive ? "text-orange-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Operator Status Footer */}
      <div className="p-3 m-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-orange-100/80 border border-orange-200/60 flex items-center justify-center text-xs font-bold text-orange-700">
          VA
        </div>
        <div className="overflow-hidden">
          <div className="text-xs font-semibold text-slate-800 truncate">Dr. V. Aris</div>
          <div className="text-[10px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Pit 4 Operations
          </div>
        </div>
      </div>
    </aside>
  );
}
