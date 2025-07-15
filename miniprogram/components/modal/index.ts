Component({
    properties: {
      visible: {
        type: Boolean,
        value: false
      },
      selectedDate: {
        type: String,
        value: ''
      },
      editingTaskId: {
        type: Number,
        value: null
      }
    },
    
    data: {
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      category: '',
      categories: ['家庭', '工作', '个人', '学习', '健康', '其他'],
      completed: false
    },
    
    observers: {
      'visible, editingTaskId': function(visible, editingTaskId) {
        if (visible && editingTaskId) {
          this.loadTaskDetails();
        } else if (visible) {
          const now = new Date();
          const dateStr = this.formatDate(now);
          const timeStr = this.formatTime(now);
          
          this.setData({
            title: '',
            description: '',
            startDate: dateStr,
            startTime: timeStr,
            endDate: dateStr,
            endTime: timeStr,
            category: '',
            completed: false
          });
        }
      }
    },
  
    methods: {
      onInputChange(e) {
        const field = e.currentTarget.dataset.field;
        if (field === 'category') {
          const index = e.detail.value;
          this.setData({
            category: this.data.categories[index]
          });
        } else {
          this.setData({ [field]: e.detail.value });
        }
      },
      
      onCancel() {
        this.triggerEvent('cancel');
      },
      
      onConfirm() {
        const { title, description, startDate, startTime, endDate, endTime, category, completed } = this.data;
        if (!title.trim()) {
          wx.showToast({ title: '请输入任务名称', icon: 'none' });
          return;
        }
        
        this.triggerEvent('confirm', { 
          title, 
          description, 
          startDate, 
          startTime, 
          endDate, 
          endTime, 
          category,
          completed
        });
      },
      
      loadTaskDetails() {
        const allTasks = wx.getStorageSync('tasks') || [];
        const task = allTasks.find(t => t.id === this.data.editingTaskId);
        
        if (task) {
          this.setData({
            title: task.title,
            description: task.description || '',
            startDate: task.startDate || this.formatDate(new Date()),
            startTime: task.startTime || this.formatTime(new Date()),
            endDate: task.endDate || this.formatDate(new Date()),
            endTime: task.endTime || this.formatTime(new Date()),
            category: task.category || '',
            completed: task.completed || false
          });
        }
      },
      
      formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
      
      formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      },
      
      toggleStatus() {
        this.setData({
          completed: !this.data.completed
        });
      }
    }
  });