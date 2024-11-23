import TransService from "@/services/TransService";
import useSWR from "swr";

const useExpiredCount = () => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    "expiredCount",
    TransService.expiredCount,
  );

  return {
    expiredCount: data?.expired_books_count ?? 0,
    isLoading,
    error,
    isValidating,
    mutate,
  };
};

export default useExpiredCount;
