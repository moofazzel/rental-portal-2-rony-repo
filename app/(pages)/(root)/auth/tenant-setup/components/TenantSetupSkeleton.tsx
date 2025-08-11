import { Skeleton } from "@/components/ui/skeleton";

const TenantSetupSkeleton = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 sm:py-8">
      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Skeleton */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="text-center">
              {/* <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-3 sm:mb-4 bg-white/20" /> */}
              <Skeleton className="h-6 sm:h-8 w-48 sm:w-64 mx-auto mb-2 bg-white/20" />
              <Skeleton className="h-3 sm:h-4 w-36 sm:w-48 mx-auto bg-white/20" />
            </div>
          </div>

          {/* Welcome Message Skeleton */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3">
              <Skeleton className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-200 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-3 sm:h-4 w-32 sm:w-48 mb-1 bg-gray-200" />
                <Skeleton className="h-2.5 sm:h-3 w-40 sm:w-64 bg-gray-200" />
              </div>
            </div>
          </div>

          {/* Form Content Skeleton */}
          <div className="p-4 sm:p-8">
            <div className="space-y-6 sm:space-y-8">
              {/* Personal Information Section */}
              <div>
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <Skeleton className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-blue-200" />
                  <Skeleton className="h-5 sm:h-6 w-28 sm:w-40 bg-gray-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 mb-2 bg-gray-200" />
                    <Skeleton className="h-10 sm:h-11 w-full bg-gray-200" />
                    <Skeleton className="h-2.5 sm:h-3 w-24 sm:w-32 mt-1 bg-gray-200" />
                  </div>

                  {/* Email */}
                  <div>
                    <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 mb-2 bg-gray-200" />
                    <Skeleton className="h-10 sm:h-11 w-full bg-gray-200" />
                    <Skeleton className="h-2.5 sm:h-3 w-24 sm:w-32 mt-1 bg-gray-200" />
                  </div>

                  {/* Phone */}
                  <div>
                    <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 mb-2 bg-gray-200" />
                    <Skeleton className="h-10 sm:h-11 w-full bg-gray-200" />
                    <Skeleton className="h-2.5 sm:h-3 w-24 sm:w-32 mt-1 bg-gray-200" />
                  </div>
                </div>
              </div>

              {/* Property Information Section */}
              <div>
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <Skeleton className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-blue-200" />
                  <Skeleton className="h-5 sm:h-6 w-28 sm:w-40 bg-gray-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Property */}
                  <div>
                    <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 mb-2 bg-gray-200" />
                    <Skeleton className="h-10 sm:h-11 w-full bg-gray-200" />
                    <Skeleton className="h-2.5 sm:h-3 w-24 sm:w-32 mt-1 bg-gray-200" />
                  </div>

                  {/* Spot */}
                  <div>
                    <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 mb-2 bg-gray-200" />
                    <Skeleton className="h-10 sm:h-11 w-full bg-gray-200" />
                    <Skeleton className="h-2.5 sm:h-3 w-24 sm:w-32 mt-1 bg-gray-200" />
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div>
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <Skeleton className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-blue-200" />
                  <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 bg-gray-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Password */}
                  <div>
                    <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 mb-2 bg-gray-200" />
                    <Skeleton className="h-10 sm:h-11 w-full bg-gray-200" />
                    <Skeleton className="h-2.5 sm:h-3 w-24 sm:w-32 mt-1 bg-gray-200" />
                    <div className="mt-3 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <Skeleton className="h-2.5 sm:h-3 w-24 sm:w-32 mb-2 bg-gray-200" />
                      <div className="space-y-1">
                        <Skeleton className="h-2.5 sm:h-3 w-32 sm:w-40 bg-gray-200" />
                        <Skeleton className="h-2.5 sm:h-3 w-36 sm:w-44 bg-gray-200" />
                        <Skeleton className="h-2.5 sm:h-3 w-34 sm:w-42 bg-gray-200" />
                        <Skeleton className="h-2.5 sm:h-3 w-30 sm:w-38 bg-gray-200" />
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <Skeleton className="h-3 sm:h-4 w-24 sm:w-28 mb-2 bg-gray-200" />
                    <Skeleton className="h-10 sm:h-11 w-full bg-gray-200" />
                    <Skeleton className="h-2.5 sm:h-3 w-24 sm:w-32 mt-1 bg-gray-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button Skeleton */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
              <Skeleton className="h-10 sm:h-11 w-full bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantSetupSkeleton;
