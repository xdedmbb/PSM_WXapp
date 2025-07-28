const { requestApi } = require('../../utils/api');

Component({
    data: {
        year: 0,
        month: 0,
        days: [],
        selectedDate: '',
        weekDays: ['一', '二', '三', '四', '五', '六', '日'],
        today: '',
        selectedDateTasks: []
    },

    lifetimes: {
        attached() {
            const today = new Date();
            const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
            this.setData({ 
                today: todayStr,
                selectedDate: todayStr
            });
            this.renderCalendar(today.getFullYear(), today.getMonth());
            this.loadTasksForDate(todayStr);
        }
    },

    methods: {
        renderCalendar(year, month) {
            const firstDay = new Date(year, month, 1).getDay() || 7;
            const totalDays = new Date(year, month + 1, 0).getDate();
            const days = [];
            
            for (let i = 1; i < firstDay; i++) {
                days.push({ day: '', dateString: '' });
            }
            
            for (let d = 1; d <= totalDays; d++) {
                const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
                days.push({ day: d, dateString: dateStr });
            }
            
            this.setData({ year, month, days });
        },
        
        handleDayLongPress(e) {
            const date = e.currentTarget.dataset.date;
            if (!date) return;
            
            this.setData({ selectedDate: date });
            this.triggerEvent('dateLongPress', { date });
        },

        handleDayClick(e) {
            const date = e.currentTarget.dataset.date;
            if (!date) return;
            
            this.setData({ selectedDate: date }, async () => {
                try {
                    await this.loadTasksForDate(date);
                    this.triggerEvent('dayclick', { date });
                } catch (error) {
                    console.error('加载任务失败:', error);
                }
            });
        },
        
        prevMonth() {
            let { year, month } = this.data;
            if (month === 0) {
                year--;
                month = 11;
            } else {
                month--;
            }
            this.renderCalendar(year, month);
            this.loadTasksForDate(this.data.selectedDate);
        },
        
        nextMonth() {
            let { year, month } = this.data;
            if (month === 11) {
                year++;
                month = 0;
            } else {
                month++;
            }
            this.renderCalendar(year, month);
            this.loadTasksForDate(this.data.selectedDate);
        },
        
        // personal_task_manage/miniprogram/components/calendar/index.ts
async loadTasksForDate(date) {
    try {
      const app = getApp();
      const userId = app.globalData.user?.userId || 1;
  
      console.log('传递的日期:', date); // 确认日期格式
  
      const url = `/user/${userId}?date=${date}`;
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
        
        editTask(e) {
            const taskId = e.currentTarget.dataset.id;
            this.triggerEvent('editTask', { taskId });
        },
        
        deleteTask(e) {
            const taskId = e.currentTarget.dataset.id;
            this.triggerEvent('deleteTask', { taskId });
        },
        
        // 刷新任务列表
        refreshTasks() {
            this.loadTasksForDate(this.data.selectedDate);
        }
    }
});