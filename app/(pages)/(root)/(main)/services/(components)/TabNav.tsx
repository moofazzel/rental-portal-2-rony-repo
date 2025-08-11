// src/app/services/(components)/TabNav.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";

interface TabNavProps {
  activeTab: "history" | "form";
  serviceCount: number;
}

export default function TabNav({ activeTab, serviceCount }: TabNavProps) {
  return (
    <div className="flex justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg">
        <div className="flex space-x-4">
          {/* History Tab */}
          <Link
            href={{ pathname: "/services", query: { tab: "history" } }}
            passHref
          >
            <Button
              variant={activeTab === "history" ? "default" : "ghost"}
              className={`!px-4 py-3 ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Request History
              {serviceCount > 0 && (
                <Badge
                  variant="secondary"
                  className={` ${
                    activeTab === "history"
                      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                      : "text-gray-600 bg-white hover:text-gray-900"
                  }`}
                >
                  {serviceCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* New Request Tab */}
          <Link
            href={{ pathname: "/services", query: { tab: "form" } }}
            passHref
          >
            <Button
              variant={activeTab === "form" ? "default" : "ghost"}
              className={`!px-4 py-3 ${
                activeTab === "form"
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
