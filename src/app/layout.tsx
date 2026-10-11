import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finomaly — AI Firewall for Secure Financial Intelligence",
  description:
    "Detect prompt injection, jailbreaks, malicious payment memos, and attempts to bypass banking rules before a financial action is authorized.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#070B14] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
