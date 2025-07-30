import { getUserTasks } from '../../components/services/taskService';
import { Task } from '../../components/entity/task';
Page({
    data: {
        userId: wx.getStorageSync('user')?.userId||0,
        currentDate: '' as string,
        taskList: [] as Task[],
        loading: false,
        error: ''
    },

    onLoad() {
        const today = new Date();
        this.setData({
        currentDate: today.toISOString()
        });
        this.loadTasks();
    },

    async loadTasks() {
        this.setData({
        loading: true,
        error: ''
    });
    
    try {
        const tasks: Task[] = await getUserTasks(this.data.userId, new Date(this.data.currentDate));
        console.info('获取任务列表:', tasks);
        console.info("用户ID:",this.data.userId);
        
        this.setData({
            taskList: tasks,
            loading: false
        });
    } catch (err) {
        console.error('获取任务失败:', err);
        this.setData({
            error: '获取任务失败，请稍后重试',
            loading: false
        });
    }
  },

    onPullDownRefresh() {
        this.loadTasks().then(() => {
        wx.stopPullDownRefresh();
        });
    }
});

