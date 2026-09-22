"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Map, 
  TrendingUp, 
  Activity, 
  Hexagon,
  ShieldCheck,
  Radio,
  Cpu
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Operations Overview", href: "/", icon: LayoutDashboard, desc: "CMSI Priority Queue" },
    { label: "Pit Stress Radar", href: "/fleet-map", icon: Map, desc: "Geotech & Kinematics" },
    { label: "Predictive Analytics", href: "/analytics", icon: TrendingUp, desc: "Wear vs OEM Fatigue" },
    { label: "Neural Diagnostics", href: "/diagnostics", icon: Cpu, desc: "Root-Cause Reasoner" },
  ];

  return (
    <aside className="w-64 bg-[#0B111C] text-slate-300 flex flex-col justify-between h-screen sticky top-0 border-r border-white/5 shrink-0 select-none z-30">
      <div>
        {/* Brand Logo */}
        <div className="px-5 py-5 border-b border-white/5 flex items-center gap-3 bg-black/20">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#EA580C] to-[#C2410C] flex items-center justify-center shadow-md shadow-orange-950/50 text-white">
            <Hexagon className="w-5 h-5 fill-white/20 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-sm font-black tracking-widest text-white uppercase flex items-center gap-1.5">
              TerraCortex
            </div>
            <div className="text-[10px] tracking-widest text-orange-500 uppercase font-mono font-bold">
              AI Operations Engine
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-5">
          <div className="px-3 mb-3 text-[10px] font-bold text-slate-500 tracking-widest uppercase font-mono flex items-center justify-between">
            <span>Operational Console</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === "/diagnostics" && pathname === "/copilot");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-start gap-3 px-3.5 py-3 rounded-lg text-xs transition-all relative group ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500/15 to-transparent text-white border-l-2 border-orange-500 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 transition ${
                    isActive ? "text-orange-500" : "text-slate-500 group-hover:text-slate-300"
                  }`} />
                  <div>
                    <div className="leading-snug">{item.label}</div>
                    <div className="text-[10px] text-slate-500 font-mono font-normal mt-0.5">{item.desc}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Operator Status Footer */}
      <div className="p-3 m-3 rounded-xl bg-[#0F1626] border border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-orange-400 font-mono">
          VA
        </div>
        <div className="overflow-hidden">
          <div className="text-xs font-bold text-slate-200 truncate">Dr. V. Aris</div>
          <div className="text-[10px] text-slate-500 font-mono truncate flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Pit 4 Director
          </div>
        </div>
      </div>
    </aside>
  );
}
