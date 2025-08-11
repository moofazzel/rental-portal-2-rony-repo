import { Card, CardContent } from "@/components/ui/card";

export function NoticeCardSkeleton() {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Main Content */}
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse"></div>
              </div>
            </div>

            {/* Content Preview */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-28 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              <div className="h-5 bg-gray-200 rounded-full w-12 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded-full w-16 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded-full w-14 animate-pulse"></div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:flex-col lg:items-end">
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
