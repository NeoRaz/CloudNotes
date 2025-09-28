export interface Note {
  id?: number;
  title: string;
  description: string;
  status_id: number;
  priority_id: number;
  due_date?: string;
  is_pinned?: boolean;
}
