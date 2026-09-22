"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Map, 
  TrendingUp, 
  Bot, 
  HardHat, 
  Sliders, 
  ShieldAlert,
  Hexagon
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Fleet Map", href: "/fleet-map", icon: Map },
    { label: "Analytics", href: "/analytics", icon: TrendingUp },
    { label: "AI Copilot", href: "/copilot", icon: Bot },
  ];

  const configItems = [
    { label: "Fleet Registry", href: "/registry", icon: HardHat },
    { label: "Site Configuration", href: "/site-config", icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-[#131A26] text-white flex flex-col justify-between h-screen sticky top-0 border-r border-[#1E293B] shrink-0 select-none z-30">
      <div>
        {/* Brand Logo */}
        <div className="px-6 py-5 border-b border-[#1E293B]/70 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E65100] to-[#F57C00] flex items-center justify-center shadow-lg shadow-orange-950/40 text-white font-bold">
            <Hexagon className="w-5 h-5 fill-white/20 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-sm font-black tracking-wider text-white uppercase flex items-center gap-1.5">
              TerraCortex
            </div>
            <div className="text-[10px] tracking-widest text-[#94A3B8] uppercase font-semibold font-mono">
              Operations Intelligence
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="px-3 py-4 space-y-6">
          {/* Fleet Operations */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold text-[#64748B] tracking-wider uppercase font-mono">
              Fleet Operations
            </div>
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#E65100] text-white shadow-md shadow-orange-950/30"
                        : "text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#94A3B8]"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Fleet Configuration */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold text-[#64748B] tracking-wider uppercase font-mono">
              Fleet Configuration
            </div>
            <div className="space-y-1">
              {configItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#E65100] text-white shadow-md shadow-orange-950/30"
                        : "text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#94A3B8]"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="p-3 border-t border-[#1E293B]/70 m-3 rounded-xl bg-[#172033] flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-sm font-bold overflow-hidden shadow-inner">
          <span className="text-orange-400">VA</span>
        </div>
        <div className="overflow-hidden">
          <div className="text-xs font-bold text-white truncate">Dr. V. Aris</div>
          <div className="text-[10px] text-[#94A3B8] tracking-wider uppercase font-mono truncate">Fleet Director</div>
        </div>
      </div>
    </aside>
  );
}
