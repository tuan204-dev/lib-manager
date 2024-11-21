import TransService from "@/services/TransService";
import { TransSearchParams } from "@/types/trans";
import { useState } from "react";
import useSWR from "swr";

const useTransList = () => {
  const [params, setParams] = useState<TransSearchParams>({});

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `trans-list-${JSON.stringify(params)}`,
    () => TransService.search(params),
  );

  return {
    transData: data,
    error,
    isLoading,
    isValidating,
    mutate,
    setParams,
    params,
  };
};

export default useTransList;
