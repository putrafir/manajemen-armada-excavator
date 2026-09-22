"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CopilotRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/diagnostics");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center font-mono text-xs text-slate-400">
      <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin mb-3"></div>
      <div>Transferring to Root-Cause Neural Diagnostics Console...</div>
    </div>
  );
}
