"use client";

import { getCurrencyInfo, getAllCurrencies } from "@/lib/actions/product";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next/client";

export const useCurrency = () => {
  const queryClient = useQueryClient();

  const {
    data: currencyList,
    isLoading: isLoadingList,
    refetch: refetchCurrency,
  } = useQuery<ICurrencyOption[]>({
    queryKey: ["currencyList"],
    queryFn: getAllCurrencies,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const { data: currencyInfo, isLoading: isLoadingCurrency } =
    useQuery<ICurrencyOption>({
      queryKey: ["currencyInfo"],
      queryFn: async () => {
        const localCurrency = getCookie("currencyInfo");
        return localCurrency
          ? JSON.parse(localCurrency)
          : await getCurrencyInfo();
      },
    });

  const { mutate: setCurrency } = useMutation({
    mutationFn: getCurrencyInfo,
    onSuccess: async (newCurrency) => {
      queryClient.setQueryData(["currencyInfo"], newCurrency);
    },
  });

  return {
    currencyInfo,
    isLoadingCurrency,
    currencyList,
    isLoadingList,
    setCurrency,
    refetchCurrency,
  };
};
