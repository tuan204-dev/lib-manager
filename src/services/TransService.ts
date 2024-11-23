import { ITrans, TransSearchParams } from "@/types/trans";
import axiosInstance from "./axios";
import { APIResponse } from "@/types/common";

const borrow = async (params: {
  student_id: string;
  book_id: string;
  days_registered: number;
}) => {
  await axiosInstance.post(`/trans/add`, params);
};

const returnBook = async (params: { student_id: string; book_id: string }) => {
  await axiosInstance.put(`/trans/return`, params);
};

const search = async (params: TransSearchParams) => {
  const { page = 1, pageSize = 20, ...rest } = params;

  const { data } = await axiosInstance.post<APIResponse<ITrans[]>>(
    `/trans/search?page=${page}&page_size=${pageSize}`,
    rest,
  );

  return data;
};

const expiredCount = async () => {
  const { data } = await axiosInstance.get<{ expired_books_count: number }>(
    `/trans/expired/count`,
  );

  return data;
};

interface ExpiredListParams {
  student_id?: string;
  book_id?: string;
  order_by?: string;
  order: "ASC" | "DESC";
  page?: number;
  pageSize?: number;
}

const expiredList = async ({
  page = 1,
  pageSize = 20,
  ...rest
}: ExpiredListParams) => {
  const { data } = await axiosInstance.post<APIResponse<ITrans>>(
    `/trans/expired?page=${page}&page_size=${pageSize}`,
    { ...rest },
  );

  return data;
};

const TransService = {
  borrow,
  returnBook,
  search,
  expiredCount,
  expiredList,
};

export default TransService;
