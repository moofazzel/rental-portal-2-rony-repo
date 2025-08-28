import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SystemHealthSkeleton() {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-900 to-slate-800 text-white">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg bg-slate-700" />
          <Skeleton className="h-6 w-28 bg-slate-700" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg bg-slate-700" />
              <div>
                <Skeleton className="h-4 w-32 mb-1 bg-slate-700" />
                <Skeleton className="h-3 w-20 bg-slate-700" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
