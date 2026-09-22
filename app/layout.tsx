import type { Metadata } from "next";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";

export const metadata: Metadata = {
  title: "TerraCortex — Heavy Excavator Fleet Operations Intelligence",
  description: "AI-Powered Fleet Operations Intelligence & Severity-Weighted Maintenance System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080C14] text-slate-100 min-h-screen antialiased selection:bg-orange-500 selection:text-white">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
