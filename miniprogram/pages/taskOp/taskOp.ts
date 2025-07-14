Page({
    data: {
      taskId: null as number | null,
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      remindTime: '',
      priority: 1,  // 默认中等优先级
      repeatType: 'none', // none/daily/weekly/monthly
      repeatValue: '',
      repeatEnd: ''
    },
  
    onLoad(options) {
      if (options.id) {
        this.setData({ taskId: Number(options.id) });
        this.loadTaskDetails(options.id);
      }
    },
  
    async loadTaskDetails(id: string) {
      // 调用接口获取任务详情，填充表单
      try {
        const res: any = await wx.cloud.callFunction({
          name: 'getTask',
          data: { id }
        });
        if (res.result) {
          this.setData({
            ...res.result,
            repeatType: res.result.repeat_type || 'none',
            repeatValue: res.result.repeat_value || '',
            repeatEnd: res.result.repeat_end || ''
          });
        }
      } catch (err) {
        wx.showToast({ title: '加载任务失败', icon: 'none' });
      }
    },
  
    onInputChange(e: WechatMiniprogram.Input) {
      const field = e.currentTarget.dataset.field;
      this.setData({ [field]: e.detail.value });
    },
  
    async onSave() {
      // 简单校验
      if (!this.data.title) {
        wx.showToast({ title: '请输入任务标题', icon: 'none' });
        return;
      }
  
      const payload = {
        title: this.data.title,
        description: this.data.description,
        startTime: this.data.startTime,
        endTime: this.data.endTime,
        remindTime: this.data.remindTime,
        priority: this.data.priority,
        repeatType: this.data.repeatType,
        repeatValue: this.data.repeatValue,
        repeatEnd: this.data.repeatEnd
      };
  
      try {
        let res;
        if (this.data.taskId) {
          res = await wx.cloud.callFunction({
            name: 'updateTask',
            data: { id: this.data.taskId, ...payload }
          });
        } else {
          res = await wx.cloud.callFunction({
            name: 'addTask',
            data: payload
          });
        }
        wx.showToast({ title: '保存成功' });
        wx.navigateBack();
      } catch (err) {
        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    }
  });
  