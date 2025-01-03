import { useAppSelector } from "@/hooks/useStore";

export const useAuthSelector = () => useAppSelector((state) => state.auth);
