import { Student } from "./student";

export interface ILib {
  id: string;
  check_in: number;
  check_out: number | null;
  student: Student;
}
