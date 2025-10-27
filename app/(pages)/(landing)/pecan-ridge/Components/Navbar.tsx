"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ApplicationModal from "./ApplicationModal";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/70 backdrop-blur-md  shadow-lg shadow-black/5"
          : "bg-transparent backdrop-blur-none border-b-0 shadow-none"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div
          className={`flex justify-between items-center h-20 ${
            isScrolled ? "h-20" : "h-32"
          }`}
        >
          <Link href="/pecan-ridge" className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <Image
                src={
                  isScrolled
                    ? "/PecanRidge/Pecan Ridge-03.png"
                    : ("/PecanRidge/Pecan Ridge-02.png" as string)
                }
                alt="Pecan Ridge"
                width={isScrolled ? 120 : 200}
                height={isScrolled ? 120 : 200}
                className="transition-all duration-300"
              />
            </div>
          </Link>

          <div className="flex gap-3">
            <Link href="/auth/signin">
              <Button
                variant="outline"
                className="border-slate-300 hover:bg-slate-50 hidden sm:inline-flex rounded-lg"
              >
                Resident Login
              </Button>
            </Link>
            <ApplicationModal variant="compact" />
          </div>
        </div>
      </div>
    </nav>
  );
}
