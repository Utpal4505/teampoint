export interface AssignedTask {
  id: number;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  project: {
    id: number;
    name: string;
  } | null;
  assignedTo: {
    id: number;
    name: string;
  } | null;
}