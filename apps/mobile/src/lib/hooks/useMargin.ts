import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryClient";
import { useAuthStore } from "../../stores/authStore";
import { useMarginStore } from "../../stores/marginStore";
import { getMargin, getMarginHistory } from "../../services/api";
import type { Margin, MarginHistory } from "../../services/api";

export function useMargin() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setMargin = useMarginStore((state) => state.setMargin);

  return useQuery({
    queryKey: queryKeys.margin,
    queryFn: (): Promise<Margin> => getMargin(),
    enabled: Boolean(accessToken),
    onSuccess: (data) => setMargin(data),
    refetchInterval: 1000 * 60 * 5,
  });
}

export function useMarginHistory() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setHistory = useMarginStore((state) => state.setHistory);

  return useQuery({
    queryKey: queryKeys.marginHistory,
    queryFn: (): Promise<MarginHistory[]> => getMarginHistory(),
    enabled: Boolean(accessToken),
    onSuccess: (data) => setHistory(data),
    staleTime: 1000 * 60 * 30,
  });
}

export function useMarginPercentage() {
  const { data: margin, ...rest } = useMargin();

  const percentage = margin ? (margin.used / margin.total) * 100 : 0;

  return {
    data: percentage,
    margin,
    ...rest,
  };
}

type MarginStatus =
  | { status: "loading"; color: string; message: string }
  | {
      status: "unavailable";
      color: string;
      message: string;
      percentage: number;
    }
  | {
      status: "healthy" | "warning" | "critical";
      color: string;
      message: string;
      percentage: number;
    };

export function useMarginStatus(): MarginStatus {
  const { data: margin, isLoading, error } = useMargin();

  if (isLoading || error || !margin) {
    return {
      status: "loading",
      color: "gray",
      message: "Carregando margem...",
    };
  }

  const percentage = (margin.used / margin.total) * 100;

  if (margin.available === 0) {
    return {
      status: "unavailable",
      color: "gray",
      message: "Nenhuma margem disponivel",
      percentage,
    };
  }

  if (percentage < 50) {
    return {
      status: "healthy",
      color: "green",
      message: "Margem saudavel",
      percentage,
    };
  }

  if (percentage < 80) {
    return {
      status: "warning",
      color: "yellow",
      message: "Atencao: margem limitada",
      percentage,
    };
  }

  return {
    status: "critical",
    color: "red",
    message: "Alerta: margem quase esgotada",
    percentage,
  };
}
