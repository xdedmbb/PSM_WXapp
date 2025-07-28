import { callDifyAPI } from '../../utils/api';

Page({
  data: {
    inputText: '',
    responseText: '',
    socket: null as WechatMiniprogram.SocketTask | null
  },

  onUnload() {
    this.closeSocket();
  },

  closeSocket() {
    if (this.data.socket) {
      this.data.socket.close();
      this.setData({ socket: null });
    }
  },

  onInput(e: WechatMiniprogram.Input) {
    this.setData({ inputText: e.detail.value });
  },

  async sendMessage() {
    const { inputText } = this.data;
    if (!inputText.trim()) return;

    // 清理上次连接
    this.closeSocket();
    
    // 初始化响应
    this.setData({ 
      responseText: '思考中...',
      inputText: '' 
    });

    try {
      const response = await callDifyAPI(inputText);
      this.setData({ responseText: response });
    } catch (e) {
      this.setData({ responseText: '请求失败: ' + e.message });
    }
  },
  
  // 添加实时更新方法（需要在app.ts中设置globalData）
  updateResponse() {
    const response = getApp().globalData.tempResponse || '';
    this.setData({ responseText: response });
  }
});