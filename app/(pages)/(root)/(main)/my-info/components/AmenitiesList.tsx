import { Badge } from "@/components/ui/badge";
import { BatteryCharging, Droplets, Settings, Wifi, Zap } from "lucide-react";

export default function AmenitiesList({ amenities }: { amenities: string[] }) {
  // 1️⃣ Figure out which AMP you should show (50 > 30)
  const has50 = amenities.includes("50 AMP");
  const has30 = !has50 && amenities.includes("30 AMP");

  // 2️⃣ Filter out any AMP entries from the rest
  const others = amenities.filter(
    (a) => a.toUpperCase() !== "30 AMP" && a.toUpperCase() !== "50 AMP"
  );

  if (!amenities || amenities.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center">No Amenities</h1>
        <p className="text-center text-gray-600 mt-2">
          Amenities are not available for this Site;
        </p>
      </div>
    );
  }

  // 3️⃣ Render
  return (
    <div className="space-y-4">
      {/* Electric Card */}
      {(has50 || has30) && (
        <div
          className={`flex items-center gap-4 p-4 rounded-xl border ${
            has50
              ? "bg-gradient-to-r from-red-50 to-red-100 border-red-100"
              : "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              has50 ? "bg-red-100" : "bg-blue-100"
            }`}
          >
            {has50 ? (
              <div className="flex items-center">
                <BatteryCharging className="w-6 h-6 text-red-600 -mr-1" />
                <Zap className="w-5 h-5 text-red-600" />
              </div>
            ) : (
              <Zap className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div className="flex-1">
            <p
              className={`font-bold text-lg ${
                has50 ? "text-red-900" : "text-blue-900"
              }`}
            >
              Electric
            </p>
            <Badge
              variant="secondary"
              className={`font-semibold ${
                has50 ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
              }`}
            >
              {has50 ? "50 AMP" : "30 AMP"}
            </Badge>
          </div>
        </div>
      )}

      {/* Other Amenities */}
      {others.map((a) => {
        const key = a.toLowerCase();
        switch (key) {
          case "water":
            return (
              <div
                key="water"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-green-900 text-lg">Water</p>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 font-semibold"
                  >
                    {a}
                  </Badge>
                </div>
              </div>
            );
          case "sewer":
            return (
              <div
                key="sewer"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-purple-900 text-lg">Sewer</p>
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 font-semibold"
                  >
                    {a}
                  </Badge>
                </div>
              </div>
            );
          case "wifi":
          case "wi fi":
            return (
              <div
                key="wifi"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Wifi className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-orange-900 text-lg">WiFi</p>
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-800 font-semibold"
                  >
                    {a}
                  </Badge>
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
