import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import client from "./client";
import type { Cafe, CafeFormValues } from "../types";

export const useCafes = (location?: string) =>
  useQuery<Cafe[]>({
    queryKey: ["cafes", location],
    queryFn: async () => {
      const { data } = await client.get("/cafes", { params: location ? { location } : {} });
      return data;
    },
  });

export const useCreateCafe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: CafeFormValues) => {
      const form = new FormData();
      form.append("name", values.name);
      form.append("description", values.description);
      form.append("location", values.location);
      if (values.logo) form.append("logo", values.logo);
      const { data } = await client.post("/cafes", form);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cafes"] }),
  });
};

export const useUpdateCafe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: CafeFormValues }) => {
      const form = new FormData();
      form.append("name", values.name);
      form.append("description", values.description);
      form.append("location", values.location);
      if (values.logo) form.append("logo", values.logo);
      const { data } = await client.put(`/cafes/${id}`, form);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cafes"] }),
  });
};

export const useDeleteCafe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/cafes/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cafes"] });
      qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};
