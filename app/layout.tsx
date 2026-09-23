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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Montserrat:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-[#F8FAFC] text-slate-900 min-h-screen antialiased selection:bg-orange-500 selection:text-white">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
