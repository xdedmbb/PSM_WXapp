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
        
        this.setData({ selectedDate: date }, () => {
          this.loadTasksForDate(date);
          this.triggerEvent('dayclick', { date });
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