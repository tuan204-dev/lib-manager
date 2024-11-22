import StudentService from "@/services/StudentService";
import { StudentSearchParams } from "@/types/student";
import { useState } from "react";
import useSWR from "swr";

const useStudentList = () => {
  const [params, setParams] = useState<StudentSearchParams>({
    page: 1,
    pageSize: 99,
  });

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `student-list-${JSON.stringify(params)}`,
    () => StudentService.search(params),
  );

  return {
    studentData: data,
    error,
    isLoading,
    isValidating,
    mutate,
    setParams,
    params,
  };
};

export default useStudentList;
