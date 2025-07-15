// pages/user-info/user-info.ts
import { request } from '../../utils/request';

Page({
  data: {
    user: {
      avatarUrl: '',
      nickname: ''
    }
  },

  onLoad() {
    this.fetchUserInfo();
  },

  async fetchUserInfo() {
    try {
      const token = wx.getStorageSync('token');
      if (!token) {
        wx.showToast({ title: '未登录，请先登录', icon: 'none' });
        return;
      }

      const res = await request({
        url: 'http://192.168.1.71:9663/api/user/info',
        method: 'GET',
        header: {
          Authorization: `Bearer ${token}`  // 加Bearer前缀
        }
      });

      if (res.statusCode === 200 && res.data.code === 200) {
        this.setData({
          user: res.data.data
        });
      } else {
        wx.showToast({ title: res.data.message || '获取用户信息失败', icon: 'none' });
      }
    } catch (error) {
      wx.showToast({ title: '请求失败', icon: 'none' });
      console.error(error);
    }
  }
});
