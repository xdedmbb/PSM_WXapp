const { requestApi } = require('../../utils/api');

Page({
    data: {
        selectedDate: '',
        today: '',
        showModal: false,
        editingTaskId: null,
        selectedDateTasks: [],
        currentUser: null
    },

    onLoad() {
        // 获取当前日期
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0]; // 格式化为YYYY-MM-DD
        
        // 获取用户信息（这里模拟用户数据）
        const app = getApp();
        const user = app.globalData.user || { 
            userId: 1, // 默认用户ID
            username: 'testUser' 
        };
        
        this.setData({ 
            today: todayStr,
            selectedDate: todayStr,
            currentUser: user
        });
        
        // 加载今日任务
        this.loadTasksForDate(todayStr);
    },

    // 处理日期选择
    onDaySelect(e) {
        const date = e.detail.date;
        this.setData({ selectedDate: date }, () => {
            this.loadTasksForDate(date);
        });
    },

    // 处理日期长按
    onDateLongPress(e) {
        const date = e.detail.date;
        this.setData({
            selectedDate: date,
            showModal: true,
            editingTaskId: null
        });
    },

    // 处理编辑任务
    onEditTask(e) {
        const taskId = e.detail.taskId;
        this.setData({
            showModal: true,
            editingTaskId: taskId
        });
    },

    // 加载指定日期任务
    // personal_task_manage/miniprogram/pages/calendar/calendar.ts
// 添加/更新任务
async loadTasksForDate(date) {
    try {
      const app = getApp();
      const userId = app.globalData.user?.userId || 1;
  
      const url = `/user/${userId}?date=${date}`;
      console.log('请求的日期:', date);
      console.log('请求的URL:', url);
  
      // 调用API获取任务
      const tasks = await requestApi(url);
      console.log('API 返回的数据:', tasks);
  
      // 确保返回的是数组
      if (!Array.isArray(tasks)) {
        throw new Error('任务数据格式不正确，期望是数组类型');
      }
  
      // 格式化日期时间显示
      const formattedTasks = tasks.map(task => ({
        ...task,
        dateFormatted: task.startTime ? task.startTime.split('T')[0] : '',
        timeFormatted: task.startTime ? task.startTime.substr(11, 5) : ''
      }));
  
      // 更新组件数据
      this.setData({ 
        selectedDateTasks: formattedTasks
      });
  
    } catch (error) {
      console.error('加载任务失败:', error);
      wx.showToast({ 
        title: '加载任务失败: ' + error.message, 
        icon: 'none',
        duration: 2000
      });
    }
  },

    // 添加/更新任务
   // 添加/更新任务
   async onAddTask(e) {
    const { title, description, startDate, startTime, endDate, endTime, category, completed } = e.detail;
    const { currentUser, selectedDate } = this.data;
    
    // 验证必填项
    if (!title || title.trim().length === 0) {
      wx.showToast({ 
        title: '任务标题不能为空', 
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    try {
      // 构建任务对象
      const taskData = {
        userId: currentUser.userId,
        title: title.trim(),
        description: description || '',
        startTime: `${startDate}T${startTime}:00`, // ISO 8601格式
        endTime: endDate && endTime ? `${endDate}T${endTime}:00` : null,
        status: completed ? 1 : 0, // 1=已完成, 0=未完成
        priority: 1, // 默认优先级
        category: category || '',
        repeatType: "none"
      };
      
      let taskId = this.data.editingTaskId;
      
      if (taskId) {
        // 更新现有任务
        taskData.taskId = taskId;
        const updateResponse = await requestApi(
          `/${taskId}`, 
          'PUT', 
          taskData
        );
        console.log('更新任务响应:', updateResponse);
      } else {
        // 创建新任务
        const createResponse = await requestApi(
          '/', 
          'POST', 
          taskData
        );
        console.log('创建任务响应:', createResponse);
        
        // 保存新任务的ID
        if (createResponse && createResponse.data) {
          taskId = createResponse.data.taskId;
        }
      }
      
      // 关闭模态框并刷新数据
      this.setData({
        showModal: false,
        editingTaskId: null
      });
      
      // 显示成功提示
      wx.showToast({ 
        title: taskId ? '任务保存成功' : '添加任务成功',
        icon: 'success',
        duration: 1500
      });
      
      // 刷新任务列表
      this.loadTasksForDate(selectedDate);
      
      // 通知日历组件刷新
      if (this.selectComponent('#calendar')) {
        this.selectComponent('#calendar').refreshTasks();
      }
      
    } catch (error) {
      console.error('保存任务失败:', error);
      wx.showToast({ 
        title: '保存失败: ' + error.message, 
        icon: 'none',
        duration: 2000
      });
    }
  },

    // 删除任务
    async onDeleteTask(e) {
        const taskId = e.detail.taskId;
        
        try {
            // 确认删除
            const confirm = await new Promise((resolve) => {
                wx.showModal({
                    title: '确认删除',
                    content: '确定要删除这个任务吗？',
                    success: (res) => resolve(res.confirm)
                });
            });
            
            if (!confirm) return;
            
            // 调用API删除任务
            await requestApi(`/${taskId}`, 'DELETE');
            
            // 更新本地数据
            this.setData({
                selectedDateTasks: this.data.selectedDateTasks.filter(
                    task => task.taskId !== taskId
                )
            });
            
            // 显示成功提示
            wx.showToast({ 
                title: '任务已删除',
                icon: 'success',
                duration: 1500
            });
            
        } catch (error) {
            console.error('删除任务失败:', error);
            wx.showToast({ 
                title: '删除失败: ' + error.message, 
                icon: 'none',
                duration: 2000
            });
        }
    },

    // 取消操作
    onCancel() {
        this.setData({ 
            showModal: false,
            editingTaskId: null
        });
    }
});