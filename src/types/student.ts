export interface Student {
  id: string;
  name: string;
  student_class: string;
  birthday: number;
  student_id: string;
}

export interface StudentSearchParams {
  name?: string;
  student_class?: string;
  student_id?: string;
  order_by?: string;
  order?: "ASC" | "DESC";
  page?: number;
  pageSize?: number;
}
