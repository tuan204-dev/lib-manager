import LibService from "@/services/LibService";
import { useState } from "react";
import useSWR from "swr";

const useLibStats = () => {
  const [dayNumber, setDayNumber] = useState(10);

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `${dayNumber}`,
    () => LibService.stats(dayNumber),
  );

  return {
    statsData: data ?? [],
    error,
    isLoading,
    isValidating,
    mutate,
    dayNumber,
    setDayNumber,
  };
};

export default useLibStats;
