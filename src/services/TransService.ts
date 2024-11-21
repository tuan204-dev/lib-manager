import { ITrans, TransSearchParams } from "@/types/trans";
import axiosInstance from "./axios";
import { APIResponse } from "@/types/common";

const borrow = async (params: {
  student_id: string;
  book_id: number;
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

const TransService = {
  borrow,
  returnBook,
  search,
};

export default TransService;
