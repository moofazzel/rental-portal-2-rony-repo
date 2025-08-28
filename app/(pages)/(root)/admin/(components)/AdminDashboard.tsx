import DashHeader from "./DashHeader";
import DashMetricTiles from "./DashMetricTiles";
import DashNotice from "./DashNotice";
import DashPendingInvites from "./DashPendingInvites";
import DashQuickActions from "./DashQuickActions";
import ServiceRequest from "./ServiceRequest";
import SystemHelth from "./SystemHelth";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <DashHeader />

        {/* Top Row - 4 Metric Tiles */}
        <DashMetricTiles />

        {/* Main Content Grid - Left Column (Service Requests + Notices) and Right Column (Quick Actions + Pending Invites) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Service Requests and Notices */}
          <div className="xl:col-span-2 space-y-8">
            <ServiceRequest />
            <DashNotice />
          </div>

          {/* Right Column - Quick Actions and Pending Invites */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <DashQuickActions />

            {/* Pending Invites */}
            <DashPendingInvites />
          </div>
        </div>

        {/* System Health */}
        <SystemHelth />
      </div>
    </div>
  );
}
