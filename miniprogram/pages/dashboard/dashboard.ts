import { getUserTasks } from '../../utils/request';

Page({
  data: {
    userId: 1001, // 实际项目中应该从登录信息中获取
    currentDate: '',
    tasks: [] as any[], // 任务列表数据
    loading: false, // 加载状态
    error: '' // 错误信息
  },

  onLoad() {
    // 获取当前日期
    const today = new Date();
    this.setData({
      currentDate: today.toISOString().split('T')[0] // 格式化为YYYY-MM-DD
    });
    
    // 加载任务数据
    this.loadTasks();
  },

  // 加载任务数据
  async loadTasks() {
    this.setData({
      loading: true,
      error: ''
    });
    
    try {
      const { userId, currentDate } = this.data;
      // 调用API获取任务列表
      const tasks = await getUserTasks(userId, currentDate);
      
      this.setData({
        tasks: tasks,
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

  // 可以添加一个下拉刷新的方法
  onPullDownRefresh() {
    this.loadTasks().then(() => {
      wx.stopPullDownRefresh();
    });
  }
  
  // 其他原有方法...
});
