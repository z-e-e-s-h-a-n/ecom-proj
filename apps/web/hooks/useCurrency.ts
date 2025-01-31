"use client";

import { getCurrencyInfo, getAllCurrencies } from "@/lib/actions/product";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next/client";

export const useCurrency = () => {
  const queryClient = useQueryClient();

  const { data: currencyList, isLoading: isLoadingList } = useQuery({
    queryKey: ["currencyList"],
    queryFn: getAllCurrencies,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const { data: currencyInfo, isLoading: isLoadingCurrency } = useQuery({
    queryKey: ["currencyInfo"],
    queryFn: async () => {
      const latestCurrency = getCookie("currencyInfo");
      return latestCurrency
        ? JSON.parse(latestCurrency)
        : await getCurrencyInfo();
    },
    staleTime: 1000 * 60 * 60,
  });

  const { mutate: setCurrency } = useMutation({
    mutationFn: getCurrencyInfo,
    onSuccess: (newCurrency) => {
      queryClient.setQueryData(["currencyInfo"], newCurrency);
      queryClient.invalidateQueries({
        queryKey: ["products", "product", "cart", "wishlist"],
      });
    },
  });

  return {
    currencyInfo,
    isLoadingCurrency,
    currencyList,
    isLoadingList,
    setCurrency,
  };
};
