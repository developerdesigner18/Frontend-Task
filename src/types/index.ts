export interface Todo {
  id: string;
  title: string;
  description?: string;
  file_path?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TodoFormData {
  title: string;
  description: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}



export interface PaginatedTodos {
  current_page: number;
  data: Todo[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

