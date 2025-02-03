import { getCurrentUser } from "@/lib/actions/user";
import { useQuery } from "@tanstack/react-query";

const useAuth = () => {
  const {
    data: currentUser,
    isLoading: isUserLoading,
    error,
    refetch,
  } = useQuery<TCurrentUser>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: true,
    initialData: null,
  });

  return { currentUser, isUserLoading, error, refetch };
};

export default useAuth;
