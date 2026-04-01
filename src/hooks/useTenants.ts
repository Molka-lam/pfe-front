import { useQuery } from "@tanstack/react-query";
import { tenantsApi } from "@/api/tenants";

export function useTenants() {
  return useQuery({
    queryKey: ["tenants"],
    queryFn: tenantsApi.getAll,
  });
}
