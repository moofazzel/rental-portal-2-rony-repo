import { Card, CardContent } from "@/components/ui/card";
import { IServiceRequest } from "@/types/tenantServiceRequest.types";
import { Calendar, CheckCircle2, Clock, FileText } from "lucide-react";

interface Props {
  requests: IServiceRequest[];
}

export function SummaryCards({ requests }: Props) {
  const total = requests.length;
  // const pending = requests.filter((r) => r.status === "PENDING").length;
  const inProgress = requests.filter((r) => r.status === "IN_PROGRESS").length;
  const completed = requests.filter((r) => r.status === "COMPLETED").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Requests</p>
            <p className="text-3xl font-bold">{total}</p>
          </div>
          <FileText className="w-10 h-10 text-blue-200" />
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-yellow-100 text-sm font-medium">In Progress</p>
            <p className="text-3xl font-bold">{inProgress}</p>
          </div>
          <Clock className="w-10 h-10 text-yellow-200" />
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Completed</p>
            <p className="text-3xl font-bold">{completed}</p>
          </div>
          <CheckCircle2 className="w-10 h-10 text-green-200" />
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">This Month</p>
            {/* <p className="text-3xl font-bold">{thisMonth}</p> */}
          </div>
          <Calendar className="w-10 h-10 text-purple-200" />
        </CardContent>
      </Card>
    </div>
  );
}
