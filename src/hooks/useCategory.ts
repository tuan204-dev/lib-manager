import CategoryService from "@/services/CategoryService";
import useSWR from "swr";

const useCategory = () => {
  const {
    data: category,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR("category", CategoryService.getAll);

  const result =
    category?.results?.map((i) => ({
      value: i.label,
      label: i.label,
    })) ?? [];

  return {
    categories: result,
    error,
    isLoading,
    isValidating,
    mutate,
  };
};

export default useCategory;
