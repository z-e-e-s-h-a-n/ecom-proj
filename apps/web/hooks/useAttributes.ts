import { getAttributes } from "@/lib/actions/product";
import { useQuery } from "@tanstack/react-query";

const useAttributes = (categories?: string[]) => {
  const { data, isLoading, error } = useQuery<IAttribute[]>({
    queryKey: ["attributes", categories],
    queryFn: () => getAttributes(categories),
    initialData: [],
    // staleTime: 1000 * 60 * 60 * 24,
  });

  return { attributes: data, isLoading, error };
};

export default useAttributes;
