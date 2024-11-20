import BookService from "@/services/BookService";
import { BookSearchParams } from "@/types/book";
import { useState } from "react";
import useSWR from "swr";

const useBookList = () => {
  const [params, setParams] = useState<BookSearchParams>({});

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

export default useBookList;
