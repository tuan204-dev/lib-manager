import { Student, StudentSearchParams } from "@/types/student";
import axiosInstance from "./axios";
import { APIResponse } from "@/types/common";

const getInfo = async (studentId: string) => {
  try {
    const { data } = await axiosInstance.get<Student>(
      `/student/detail?student_id=${studentId}`,
    );

    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const add = async (params: Omit<Student, "id">) => {
  const { data } = await axiosInstance.post("/student/add", params);

  return data;
};

const search = async (params: StudentSearchParams) => {
  const { page = 1, pageSize = 20, ...rest } = params;

  const { data } = await axiosInstance.post<APIResponse<Student[]>>(
    `/student/search?page=${page}&pageSize=${pageSize}`,
    rest,
  );

  return data;
};

const StudentService = { getInfo, add, search };

export default StudentService;
