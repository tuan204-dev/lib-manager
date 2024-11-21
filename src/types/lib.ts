import { Student } from "./student";

export interface ILib {
  id: string;
  checked_in: number;
  checked_out: number | null;
  student: Student;
}

export interface LibSearchParams {
  order_by?: string;
  order?: "ASC" | "DESC";
  page?: number;
  pageSize?: number;
  name?: string;
  student_id?: string;
}
