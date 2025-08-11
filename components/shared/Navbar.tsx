import { auth } from "@/auth";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { MenuIcon } from "lucide-react";
import Link from "next/link";
// import Logout from "./Logout";
import { Route } from "@/constants/RouteConstants";
import UserDropdown from "./UserDropdown";

export default async function Navbar() {
  const session = await auth();

  const navItems = session ? [] : [{ label: "Sign In", href: Route.LoginPath }];
  return (
    <header className="w-full bg-white px-4 md:px-6 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1)]">
      <div className="flex  h-12 justify-between items-center">
        <Link
          href={
            session?.user?.role === "SUPER_ADMIN"
              ? Route.AdminPath
              : Route.DashboardPath
          }
          className="text-lg font-black tracking-wide"
          prefetch={false}
        >
          Rental Portal
        </Link>

        <nav className="flex items-center gap-6 cursor-pointer">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary cursor-pointer"
              prefetch={false}
            >
              {item.label}
            </Link>
          ))}

          {/* User Dropdown */}
          {session && <UserDropdown />}
        </nav>

        {/* Mobile Nav */}
        {/* <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] pt-3">
            <Link
              href="/"
              className="text-lg font-bold mb-0 md:mb-4 block"
              prefetch={false}
            >
              Beck Row
            </Link>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-5rem)] pr-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base font-medium"
                  prefetch={false}
                >
                  {item.label}
                </Link>
              ))}
              {session && <Logout />}
            </div>
          </SheetContent>
        </Sheet> */}
      </div>
    </header>
  );
}
