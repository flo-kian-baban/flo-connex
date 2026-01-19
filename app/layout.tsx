import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/lib/toast-context";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans"
});

export const metadata: Metadata = {
  title: "Connex | The Marketplace for Creators",
  description: "Connect with verified influencers and scale your brand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} antialiased font-sans`} suppressHydrationWarning>
        <AuthProvider>
          <ToastProvider >
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
