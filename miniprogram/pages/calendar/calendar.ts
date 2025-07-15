Page({
    data: {
      selectedDate: '',
      today: '',
      showModal: false,
      editingTaskId: null,
      selectedDateTasks: []
    },
  
    onLoad() {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
      this.setData({ 
        today: todayStr, 
        selectedDate: todayStr 
      });
      this.loadTasksForDate(todayStr);
    },
  
    onDaySelect(e) {
      const date = e.detail.date;
      this.setData({ selectedDate: date }, () => {
        this.loadTasksForDate(date);
      });
    },
  
    onDateLongPress(e) {
      const date = e.detail.date;
      this.setData({
        selectedDate: date,
        showModal: true,
        editingTaskId: null
      });
    },
  
    onEditTask(e) {
      const taskId = e.detail.taskId;
      this.setData({
        showModal: true,
        editingTaskId: taskId
      });
    },
  
    onDeleteTask(e) {
      const taskId = e.detail.taskId;
      wx.showModal({
        title: '确认删除',
        content: '确定要删除这个任务吗？',
        success: (res) => {
          if (res.confirm) {
            const allTasks = wx.getStorageSync('tasks') || [];
            const updatedTasks = allTasks.filter(task => task.id !== taskId);
            wx.setStorageSync('tasks', updatedTasks);
            
            this.setData({
              selectedDateTasks: this.data.selectedDateTasks.filter(task => task.id !== taskId)
            });
            
            wx.showToast({ title: '任务已删除' });
          }
        }
      });
    },
  
    loadTasksForDate(date) {
      const allTasks = wx.getStorageSync('tasks') || [];
      const tasksForDate = allTasks.filter(task => task.date === date);
      
      tasksForDate.sort((a, b) => {
        if (a.startTime && b.startTime) {
          return a.startTime.localeCompare(b.startTime);
        }
        return 0;
      });
      
      this.setData({ selectedDateTasks: tasksForDate });
    },
  
    onCancel() {
      this.setData({ 
        showModal: false,
        editingTaskId: null
      });
    },
  
    onAddTask(e) {
      const { title, description, startDate, startTime, endDate, endTime, category, completed } = e.detail;
      const allTasks = wx.getStorageSync('tasks') || [];
      
      if (this.data.editingTaskId) {
        // 编辑已有任务
        const taskIndex = allTasks.findIndex(task => task.id === this.data.editingTaskId);
        if (taskIndex !== -1) {
          allTasks[taskIndex] = {
            ...allTasks[taskIndex],
            title,
            description,
            startDate,
            startTime,
            endDate,
            endTime,
            category,
            completed
          };
        }
        wx.showToast({ title: '任务更新成功' });
      } else {
        // 添加新任务
        const newTask = {
          id: Date.now(), // 使用时间戳作为唯一ID
          title,
          date: this.data.selectedDate,
          startDate,
          startTime,
          endDate,
          endTime,
          description,
          category,
          completed
        };
        allTasks.push(newTask);
        wx.showToast({ title: '添加任务成功' });
      }
      
      wx.setStorageSync('tasks', allTasks);
      
      this.setData({
        showModal: false,
        editingTaskId: null
      }, () => {
        // 刷新任务列表
        this.loadTasksForDate(this.data.selectedDate);
        
        // 通知日历组件刷新
        this.selectComponent('#calendar').refreshTasks();
      });
    }
  });