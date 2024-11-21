import LibService from "@/services/LibService";
import { LibSearchParams } from "@/types/lib";
import { useState } from "react";
import useSWR from "swr";

const useLibList = () => {
  const [params, setParams] = useState<LibSearchParams>({});

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `lib-list-${JSON.stringify(params)}`,
    () => LibService.search(params),
  );

  return {
    libData: data,
    error,
    isLoading,
    isValidating,
    mutate,
    setParams,
    params,
  };
};

export default useLibList;
