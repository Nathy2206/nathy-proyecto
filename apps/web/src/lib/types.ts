export interface Task {
  id: string;
  title: string;
  completed?: boolean;
  done?: boolean; // o el que use tu backend
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateTaskInput {
  title?: string;
  completed?: boolean;
  done?: boolean;
}