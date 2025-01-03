import { useAppSelector } from "@/hooks/useStore";

export const useUserSelector = () => useAppSelector((state) => state.user);
