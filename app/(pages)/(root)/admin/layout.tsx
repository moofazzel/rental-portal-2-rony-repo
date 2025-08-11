import Navbar from "@/components/shared/Navbar";
import { isAuthenticated, isAuthorized } from "@/lib/utils";
import Providers from "@/providers/Providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "react-phone-input-2/lib/style.css";
import { Toaster } from "sonner";
import SideNav from "../(main)/(components)/SideNav";
import "../../globals.css";

// Force dynamic rendering for admin pages to prevent auth issues during build
export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beck Row",
  description: "Rental Portal",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await isAuthenticated();
  await isAuthorized();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="flex h-screen">
            <div className="flex-1 bg-gray-50 overflow-y-auto shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1)]">
              <Navbar />

              <div
                style={{
                  height: "calc(100vh - 50px)",
                  // width: "calc(100vw - 70px)",
                }}
                className="flex overflow-hidden"
              >
                <SideNav />

                <main className="flex-1 rounded-lg overflow-auto">
                  {children}
                </main>
              </div>
            </div>
          </div>
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
