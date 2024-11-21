import { ILib, LibSearchParams } from "@/types/lib";
import axiosInstance from "./axios";
import { APIResponse } from "@/types/common";

const checkIn = async (studentId: string) => {
  const { data } = await axiosInstance.post("/lib/check-in", {
    student_id: studentId,
  });

  return data;
};

const checkOut = async (studentId: string) => {
  const { data } = await axiosInstance.put("/lib/check-out", {
    student_id: studentId,
  });

  return data;
};

const search = async ({
  name,
  student_id,
  order,
  order_by,
  page = 1,
  pageSize = 20,
}: LibSearchParams) => {
  const { data } = await axiosInstance.post<APIResponse<ILib[]>>(
    `/lib/inlibrary?page=${page}&page_size=${pageSize}`,
    {
      name,
      student_id,
      order,
      order_by,
    },
  );

  return data;
};

interface StatsItem {
  timestamp: number;
  check_in_count: number;
  date: string;
}

const stats = async (count: number) => {
  const { data } = await axiosInstance.post<StatsItem[]>("/lib/countinday", {
    count,
  });

  return data;
};

const LibService = {
  checkIn,
  checkOut,
  search,
  stats,
};

export default LibService;
