import { requestApi } from '../../utils/api';

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
      'visible, editingTaskId': async function(visible, editingTaskId) {
        if (visible && editingTaskId) {
          try {
            const res: any = await requestApi(`/${editingTaskId}`, 'GET');
            const task = res; // 修改这里，直接使用res
            this.setData({
              title: task.title,
              description: task.description || '',
              startDate: task.startTime ? task.startTime.split('T')[0] : this.formatDate(new Date()),
              startTime: task.startTime ? task.startTime.substr(11, 5) : this.formatTime(new Date()),
              endDate: task.endTime ? task.endTime.split('T')[0] : this.formatDate(new Date()),
              endTime: task.endTime ? task.endTime.substr(11, 5) : this.formatTime(new Date()),
              category: task.category || '',
              completed: task.status === 1
            });
          } catch (error) {
            wx.showToast({ title: '加载任务详情失败', icon: 'none' });
          }
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