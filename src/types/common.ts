export interface ModalState {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

export interface APIResponse<T> {
  count: number;
  total_elements: number;
  total_pages: number;
  current_page: number;
  results: T;
}
