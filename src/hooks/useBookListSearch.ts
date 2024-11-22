import BookService from "@/services/BookService";
import { BookSearchParams } from "@/types/book";
import { useState } from "react";
import useSWR from "swr";

const useBookListSearch = () => {
  const [params, setParams] = useState<BookSearchParams>({
    page: 1,
    pageSize: 99,
  });

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `book-list-${JSON.stringify(params)}`,
    () => BookService.search(params),
  );

  return {
    bookData: data,
    error,
    isLoading,
    isValidating,
    mutate,
    setParams,
    params,
  };
};

export default useBookListSearch;
