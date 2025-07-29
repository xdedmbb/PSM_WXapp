import { request } from '../../utils/request';
import { Task } from '../../components/entity/task';

export async function getUserTasks(userId: string, date: Date): Promise<Task[]> {
    let url = `/api/tasks/user/${userId}`;
    
    if (date) {
        url += `?date=${date.toISOString().split('T')[0]}`;
    }
    
    return request(url, 'GET') as Promise<Task[]>;
}