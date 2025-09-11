"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Route } from "@/constants/RouteConstants";
import { cn } from "@/lib/utils";
import {
  BellPlus,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cog,
  CreditCard,
  FileText,
  HandCoins,
  History,
  Home,
  LayoutDashboard,
  User,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  href: string;
  tooltip: string;
}

interface NavSection {
  key: string;
  title: string;
  stateKey: keyof DropdownState;
  items: NavItem[];
}

interface DropdownState {
  isMainDropdownOpen: boolean;
  isAccountDropdownOpen: boolean;
}

const NAV_SECTIONS: NavSection[] = [
  {
    key: "admin",
    title: "Admin",
    stateKey: "isMainDropdownOpen",
    items: [
      {
        key: "dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
        label: "Dashboard",
        href: "/admin",
        tooltip: "Dashboard",
      },
      {
        key: "property",
        icon: <Building2 className="h-5 w-5" />,
        label: "Properties",
        href: Route.PropertyPath,
        tooltip: "Properties",
      },
      {
        key: "tenants",
        icon: <Users className="h-5 w-5" />,
        label: "Tenants",
        href: "/admin/tenants",
        tooltip: "Tenants",
      },
      {
        key: "payments",
        icon: <HandCoins className="h-5 w-5" />,
        label: "Payments",
        href: "/admin/payments",
        tooltip: "Payments",
      },
      {
        key: "services",
        icon: <Cog className="h-5 w-5" />,
        label: "Services",
        href: "/admin/requests",
        tooltip: "Services",
      },
      {
        key: "notices",
        icon: <BellPlus className="h-5 w-5" />,
        label: "Notices",
        href: "/admin/notices",
        tooltip: "Notices",
      },
      {
        key: "documents",
        icon: <FileText className="h-5 w-5" />,
        label: "Documents",
        href: "/admin/admin-documents",
        tooltip: "Documents",
      },
      {
        key: "stripe-accounts",
        icon: <CreditCard className="h-5 w-5" />,
        label: "Stripe Accounts",
        href: "/admin/stripe-accounts",
        tooltip: "Stripe Accounts",
      },
    ],
  },
  {
    key: "main",
    title: "Main",
    stateKey: "isMainDropdownOpen",
    items: [
      {
        key: "dashboard",
        icon: <Home className="h-5 w-5" />,
        label: "Dashboard",
        href: "/",
        tooltip: "Dashboard",
      },
      {
        key: "my-info",
        icon: <User className="h-5 w-5" />,
        label: "My Info",
        href: "/my-info",
        tooltip: "My Info",
      },
      {
        key: "pay-rent",
        icon: <Wallet className="h-5 w-5" />,
        label: "Pay Rent",
        href: "/pay-rent",
        tooltip: "Pay Rent",
      },
      {
        key: "history",
        icon: <History className="h-5 w-5" />,
        label: "Payment History",
        href: "/history",
        tooltip: "Payment History",
      },
      {
        key: "services",
        icon: <Wrench className="h-5 w-5" />,
        label: "Services",
        href: "/services",
        tooltip: "Services",
      },
      // {
      //   key: "Notices",
      //   icon: <BellPlus className="h-5 w-5" />,
      //   label: "Notices",
      //   href: "/notices",
      //   tooltip: "Notices",
      // },
    ],
  },
];

export default function SideNav() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState<DropdownState>({
    isMainDropdownOpen: true,
    isAccountDropdownOpen: true,
  });
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);

  // get the session data
  const { data: session } = useSession();
  const pathname = usePathname();

  const visibleSections = NAV_SECTIONS.filter((section) =>
    session?.user?.role === "SUPER_ADMIN"
      ? section.key === "admin"
      : section.key === "main"
  );

  // Check if a link is active
  const isActive = (href: string) => {
    return pathname === href;
  };

  useEffect(() => {
    const saved = localStorage.getItem("isSideNavOpen");
    if (saved !== null) {
      setIsSideNavOpen(saved === "true");
    }
  }, []);

  const toggleSideNav = () => {
    setIsSideNavOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("isSideNavOpen", newState.toString());
      // Close any open tooltips when collapsing
      if (!newState) {
        setOpenTooltip(null);
      }
      return newState;
    });
  };

  const toggleDropdown = (key: keyof DropdownState) => {
    setDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleTooltipOpen = (itemKey: string) => {
    if (!isSideNavOpen) {
      setOpenTooltip(itemKey);
    }
  };

  const handleTooltipClose = () => {
    setOpenTooltip(null);
  };

  const renderNavItems = (items: NavItem[]) =>
    items.map((item) => {
      const active = isActive(item.href);
      const isTooltipOpen = openTooltip === item.key && !isSideNavOpen;

      return (
        <TooltipProvider key={item.key}>
          <Tooltip
            open={isTooltipOpen}
            onOpenChange={(open) => {
              if (open) {
                handleTooltipOpen(item.key);
              } else {
                handleTooltipClose();
              }
            }}
          >
            <TooltipTrigger asChild>
              <Link href={item.href} className="w-full cursor-pointer">
                <div
                  className={cn(
                    "px-3 flex items-center transition-all duration-200 rounded-md gap-3 py-2.5",
                    active
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span className={cn("text-base", active && "text-blue-600")}>
                    {item.icon}
                  </span>
                  {isSideNavOpen && (
                    <span className={cn("text-sm", active && "font-medium")}>
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            </TooltipTrigger>
            {!isSideNavOpen && (
              <TooltipContent
                side="right"
                className="border-gray-200 text-xs bg-blue-600 text-white"
              >
                {item.tooltip}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      );
    });

  return (
    <aside
      style={{ width: isSideNavOpen ? "240px" : "64px" }}
      className="transition-all duration-300 ease-in-out overflow-hidden bg-white border-r border-gray-200 flex flex-col justify-between relative shadow-sm"
    >
      <div className="px-2 py-4">
        {visibleSections.map(({ key, title, stateKey, items }, index) => {
          const isOpen = dropdowns[stateKey];
          return (
            <div key={key} className="w-full mb-6">
              {index > 0 && (
                <div className="bg-gray-200 h-px w-full mb-4"></div>
              )}
              <button
                className="flex items-center justify-between w-full"
                onClick={() => toggleDropdown(stateKey)}
              >
                <span className="text-xs font-semibold tracking-wide">
                  {title}
                </span>
                <span className="text-gray-500">
                  {isOpen ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </span>
              </button>
              <div
                className={cn(
                  "transition-all duration-200 ease-in-out overflow-hidden mt-2",
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <nav className="flex flex-col gap-1">
                  {renderNavItems(items)}
                </nav>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={cn(
          "p-2 border-t border-gray-100",
          isSideNavOpen ? "flex justify-end" : "flex justify-center"
        )}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSideNav}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-50 cursor-pointer h-8 w-8 p-0"
              >
                {isSideNavOpen ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className=" text-xs bg-blue-600">
              {isSideNavOpen ? "Collapse sidebar" : "Expand sidebar"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}
