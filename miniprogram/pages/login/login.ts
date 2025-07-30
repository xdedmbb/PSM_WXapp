import {request} from '../../utils/request';

Page({
    data: {
      isLoading: false
    },
  
    async onLogin() {
      this.setData({ isLoading: true });
  
      try {
        const profileRes = await new Promise<WechatMiniprogram.GetUserProfileSuccessCallbackResult>((resolve, reject) => {
          wx.getUserProfile({
            desc: '用于完善用户信息',
            success: resolve,
            fail: reject
          });
        });
        const { nickName, avatarUrl } = profileRes.userInfo;

        const loginRes = await new Promise<WechatMiniprogram.LoginSuccessCallbackResult>((resolve, reject) => {
          wx.login({
            success: resolve,
            fail: reject
          });
        });
        const code = loginRes.code;
        if (!code) {
          wx.showToast({ title: '获取code失败', icon: 'none' });
          return;
        }

        console.log('Starting API request with:', { code, nickName, avatarUrl });
        const res = await request('/api/user/wxLogin', 'POST', {
          code,
          nickname: nickName,
          avatarUrl
        });
        console.log('API response:', res);

        if (res?.code === 200 && res.data) {
          const { token, user } = res.data;
          console.log('Login successful, received token and user:', { token, user });
          if (token) {
            wx.setStorageSync('token', token);
            console.log('Token stored in storage');
          }
          if (user) {
            wx.setStorageSync('user', user);
            console.log("存入wx.getStorageSync('user')：",wx.getStorageSync('user'));

            console.log('User data stored in storage');
          }
          wx.showToast({ title: '登录成功' });
          console.log('Navigating to dashboard');
          wx.switchTab({ url: '/pages/dashboard/dashboard' });
        } else {
          console.warn('Login failed with response:', res);
          wx.removeStorageSync('token');
          wx.showToast({ title: res?.message || '登录失败', icon: 'none' });
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes('用户拒绝授权')) {
            wx.showToast({ title: '用户拒绝授权', icon: 'none' });
          } else if (err.message.includes('获取登录凭证失败')) {
            wx.showToast({ title: '获取登录凭证失败', icon: 'none' });
          } else {
            wx.showToast({ title: '登录失败', icon: 'error' });
          }
        }
        wx.removeStorageSync('token');
      } finally {
        this.setData({ isLoading: false });
      }
    }
  });
