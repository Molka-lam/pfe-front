import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { renewalApi, RenewalRequest } from "@/api/renewal";

export function useRenewalRequests() {
  return useQuery({
    queryKey: ["renewal-requests"],
    queryFn: renewalApi.getAll,
  });
}

export function useCreateRenewalRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ license_id, message }: { license_id: string; message: string }) =>
      renewalApi.create(license_id, message),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["renewal-requests"] });
    },
  });
}

export function useUpdateRenewalStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: RenewalRequest["status"] }) =>
      renewalApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["renewal-requests"] });
    },
  });
}

export function useDeleteRenewalRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => renewalApi.deleteOne(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["renewal-requests"] });
    },
  });
}

export function useBulkDeleteRenewalRequests() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => renewalApi.bulkDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["renewal-requests"] });
    },
  });
}

export function useDeleteAllRenewalRequests() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => renewalApi.deleteAll(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["renewal-requests"] });
    },
  });
}
