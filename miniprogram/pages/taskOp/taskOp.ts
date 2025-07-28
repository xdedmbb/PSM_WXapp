Page({
    async onSave() {
        const { taskId, title, description, startTime, endTime } = this.data;
        
        try {
          const app = getApp();
          const userId = app.globalData.user?.userId || 1;
          
          // 构造任务数据
          const payload = {
            userId,
            title,
            description,
            startTime,
            endTime,
            remindTime: this.data.remindTime,
            priority: this.data.priority,
            repeatType: this.data.repeatType,
            repeatValue: this.data.repeatValue,
            repeatEnd: this.data.repeatEnd
          };
      
          if (taskId) {
            // 更新任务
            await requestApi(`/${taskId}`, 'PUT', payload);
          } else {
            // 添加任务
            await requestApi('/', 'POST', payload);
          }
          
          wx.showToast({ title: '保存成功' });
          wx.navigateBack();
        } catch (err) {
          console.error('保存失败:', err);
          wx.showToast({ title: '保存失败', icon: 'none' });
        }
      }
  });