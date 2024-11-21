import { Book, BookSearchParams } from "@/types/book";
import axiosInstance from "./axios";
import { APIResponse } from "@/types/common";

interface IBook {
  title: string;
  author: string;
  category: string;
  quantity: number;
  publish_date: number;
}

const add = async (params: IBook) => {
  const { title, author, category, quantity, publish_date } = params;

  const { data } = await axiosInstance.post("/book/add", {
    title,
    author,
    category,
    quantity,
    publish_date,
  });

  return data;
};

const edit = async (params: Partial<IBook> & { id: string }) => {
  const { id, title, author, category, quantity, publish_date } = params;

  const { data } = await axiosInstance.put("/book/edit", {
    id,
    title,
    author,
    category,
    quantity,
    publish_date,
  });

  return data;
};

const del = async (id: string) => {
  const { data } = await axiosInstance.delete(`/book/delete?id=${id}`);

  return data;
};

const search = async ({
  title,
  author,
  category,
  order_by = "title",
  order = "ASC",
  page = 1,
  pageSize = 20,
}: BookSearchParams) => {
  const { data } = await axiosInstance.post<APIResponse<Book[]>>(
    `/book/search?page=${page}&page_size=${pageSize}`,
    {
      title,
      author,
      category,
      order_by,
      order,
    },
  );

  return data;
};

const BookService = {
  add,
  edit,
  del,
  search,
};

export default BookService;
