export interface BookSearchParams {
  page?: number;
  pageSize?: number;
  title?: string;
  author?: string;
  category?: string;
  order_by?: string;
  order?: "ASC" | "DESC";
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  cover_image: string;
  publish_date: number;
  quantity: number;
}
