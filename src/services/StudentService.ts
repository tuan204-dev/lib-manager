import { Student } from "@/types/student";
import axiosInstance from "./axios";

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

const StudentService = { getInfo, add };

export default StudentService;
