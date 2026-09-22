import type { Metadata } from "next";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";

export const metadata: Metadata = {
  title: "TerraCortex — Excavator Fleet Operations Intelligence",
  description: "AI-powered operations intelligence system for excavator fleets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F4F6F9] min-h-screen text-slate-900 antialiased">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
