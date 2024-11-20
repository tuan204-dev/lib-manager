import { APIResponse } from "@/types/common";
import axiosInstance from "./axios";
import { Category } from "@/types/category";

const getAll = async () => {
  const { data } =
    await axiosInstance.get<APIResponse<Category[]>>("/category/all");

  return data;
};

const CategoryService = { getAll };

export default CategoryService;
