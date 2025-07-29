export interface Task {
  taskId: number;
  title: string;
  status: number;
  priority: number;
  userId: number;
  description?: string;
  createTime: string;
  startTime: string;
  endTime: string;
  remindTime?: string;
  repeatType: string;
  repeatValue?: string | null;
  repeatEnd?: string | null;
  tags?: string | null;
}