import { getProduct } from "@/lib/actions/product";
import { useQuery } from "@tanstack/react-query";

const useProduct = (productId: string) => {
  const { data, isLoading, error } = useQuery<IProduct>({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    enabled: !!productId,
  });

  return { product: data, isProductLoading: isLoading, error };
};

export default useProduct;
