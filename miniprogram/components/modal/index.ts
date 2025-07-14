Component({
    properties: {
      visible: Boolean
    },
    data: {
      inputValue: ''
    },
    methods: {
      onInput(e) {
        this.setData({ inputValue: e.detail.value });
      },
      onCancel() {
        this.setData({ inputValue: '' });
        this.triggerEvent('cancel');
      },
      onConfirm() {
        const value = this.data.inputValue.trim();
        if (!value) {
          wx.showToast({ title: '请输入内容', icon: 'none' });
          return;
        }
        this.triggerEvent('confirm', { title: value });
        this.setData({ inputValue: '' });
      }
    }
  });
  