import { updateUserById } from "@/app/apiClient/adminApi";
import { ITenant } from "@/types/tenant.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateTenantInput {
  userId: string;
  data: Partial<ITenant>;
}

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: UpdateTenantInput) =>
      updateUserById({ userId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] }); // ✅ Refetch updated list
    },
  });
};
