import { getCategories } from "@/lib/actions/product";
import { useQuery } from "@tanstack/react-query";

const useCategories = () => {
  const { data, isLoading, error } = useQuery<ICategory[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
    initialData: [],
    // staleTime: 1000 * 60 * 60 * 24,
  });

  return { categories: data, isLoading, error };
};

export default useCategories;
