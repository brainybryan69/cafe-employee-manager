import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import client from "./client";
import type { Employee, EmployeeFormValues } from "../types";

export const useEmployees = (cafe?: string) =>
  useQuery<Employee[]>({
    queryKey: ["employees", cafe],
    queryFn: async () => {
      const { data } = await client.get("/employees", { params: cafe ? { cafe } : {} });
      return data;
    },
  });

export const useCreateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: EmployeeFormValues) => {
      const { data } = await client.post("/employees", values);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
  });
};

export const useUpdateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: EmployeeFormValues }) => {
      const { data } = await client.put(`/employees/${id}`, { id, ...values });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
  });
};

export const useDeleteEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/employees/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
  });
};
