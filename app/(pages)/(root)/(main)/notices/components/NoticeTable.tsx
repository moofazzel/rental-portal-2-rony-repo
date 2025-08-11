import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { Bell, Calendar, CheckCircle, XCircle } from "lucide-react";

export function NoticeTable() {
  //   const [selectedNotice, setSelectedNotice] = useState<any | null>(null);
  //   const [modalOpen, setModalOpen] = useState(false);

  const fakeNotices = [
    {
      id: "1",
      title: "Water Outage Notice",
      content:
        "Due to maintenance, water will be unavailable from 9 AM to 3 PM tomorrow.",
      type: "Maintenance",
      priority: "High",
      isActive: true,
      expiryDate: "2025-07-15T00:00:00Z",
    },
    {
      id: "2",
      title: "Community BBQ",
      content:
        "Join us for a community BBQ this Sunday at the central park area!",
      type: "Event",
      priority: "Low",
      isActive: true,
      expiryDate: "2025-07-14T00:00:00Z",
    },
    {
      id: "3",
      title: "Fire Drill",
      content: "A fire drill will take place on Monday. Please cooperate.",
      type: "Safety",
      priority: "Medium",
      isActive: false,
      expiryDate: "2025-07-13T00:00:00Z",
    },
    {
      id: "4",
      title: "New Parking Rules",
      content: "Please read the updated parking policy effective August 1st.",
      type: "Policy",
      priority: "High",
      isActive: true,
      expiryDate: "2025-08-01T00:00:00Z",
    },
    {
      id: "5",
      title: "Elevator Maintenance",
      content: "Elevator 3 will be under maintenance for the next two days.",
      type: "Maintenance",
      priority: "Medium",
      isActive: false,
      expiryDate: "2025-07-18T00:00:00Z",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getStatusIcon = (notice: { isActive: boolean }) =>
    notice.isActive ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );

  const getStatusColor = (notice: { isActive: boolean }) =>
    notice.isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-gray-200 text-gray-600 border-gray-300";

  const getStatusText = (notice: { isActive: boolean }) =>
    notice.isActive ? "Active" : "Inactive";

  return (
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Notice
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Expiry Date
              </th>
            </tr>
          </thead>
          <tbody className="cursor-pointer">
            {fakeNotices.map((notice, index) => (
              <tr
                key={notice.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition-colors duration-200`}
              >
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium text-gray-900">
                      {notice.title}
                    </div>
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {notice.content.split(" ").slice(0, 15).join(" ") + "..."}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-blue-600">
                      {notice.type}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge className={getPriorityColor(notice.priority)}>
                    {notice.priority}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(notice)}
                    <Badge className={getStatusColor(notice)}>
                      {getStatusText(notice)}
                    </Badge>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {new Date(notice.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  );
}
