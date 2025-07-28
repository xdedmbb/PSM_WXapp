Component({
    properties: {
      // 定义接收的任务列表属性
      tasks: {
        type: Array,
        value: [],
        observer: function(newVal) {
          // 当任务数据变化时可以做一些处理
          console.log('任务数据更新:', newVal);
        }
      }
    },
    
    data: {
      // 组件内部状态
    },
    
    methods: {
      // 任务点击事件
      onTaskTap(e: any) {
        const taskId = e.currentTarget.dataset.taskid;
        this.triggerEvent('onTaskTap', { taskId });
      },
      
      // 任务完成状态变更
      onTaskComplete(e: any) {
        const taskId = e.currentTarget.dataset.taskid;
        this.triggerEvent('onTaskComplete', { taskId });
      },
      
      // 根据优先级获取对应的样式
      getPriorityClass(priority: number) {
        switch(priority) {
          case 0:
            return 'priority-low';
          case 1:
            return 'priority-medium';
          case 2:
            return 'priority-high';
          default:
            return '';
        }
      },
      
      // 格式化时间显示
      formatTime(timeString: string) {
        if (!timeString) return '';
        const date = new Date(timeString);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      }
    }
  });
  