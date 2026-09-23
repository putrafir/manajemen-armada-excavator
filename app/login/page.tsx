"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Hexagon, Lock, Mail, Eye, EyeOff, ShieldCheck, Cpu } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-md w-full p-8 space-y-6 text-center">
        {/* Brand Logo */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E65100] to-[#F57C00] flex items-center justify-center shadow-lg shadow-orange-950/30 text-white font-bold mb-3">
            <Hexagon className="w-7 h-7 fill-white/20 stroke-[2.5]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
            TerraCortex
          </h1>
          <div className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold font-sans">
            Operations Intelligence
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In</h2>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Excavator Fleet Operations Intelligence System
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-4 text-left text-xs font-sans">
          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
              <span>Username or Email</span>
              <span className="text-slate-400">Internal ID accepted</span>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                defaultValue="admin@terracortex.com" 
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-orange-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
              <span>Password</span>
              <a href="#" className="text-orange-600 hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type={showPassword ? "text" : "password"} 
                defaultValue="password123" 
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-orange-500 focus:bg-white"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="keep_signed" defaultChecked className="rounded text-orange-600 focus:ring-orange-500" />
            <label htmlFor="keep_signed" className="text-slate-600 text-xs select-none cursor-pointer">
              Keep me signed in for 30 days
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <Link href="/">
          <button className="w-full py-3 bg-[#E65100] hover:bg-[#D84315] text-white font-bold text-sm rounded-xl shadow-md shadow-orange-950/20 transition cursor-pointer font-sans flex items-center justify-center gap-2 mt-2">
            Sign In &rarr;
          </button>
        </Link>

        {/* Security Badges */}
        <div className="border-t border-slate-100 pt-4 flex items-center justify-center gap-6 text-[10px] font-sans text-slate-400">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> SOC2 Type II Certified</span>
          <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-slate-500" /> Hardware FIDO2 Ready</span>
        </div>
      </div>
    </div>
  );
}
