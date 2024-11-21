import { Book } from "./book";
import { Student } from "./student";

export interface ITrans {
  id: string;
  borrow_date: number;
  days_registered: number;
  return_date: number;
  created_at: number;
  updated_at: number;
  student: Student;
  book: Book;
}

export interface TransSearchParams extends Partial<Student>, Partial<Book> {
  day_remaining?: number;
  order_by?: string;
  order?: "ASC" | "DESC";
  page?: number;
  pageSize?: number;
}
