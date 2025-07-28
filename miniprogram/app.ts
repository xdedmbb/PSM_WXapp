App({
    globalData: {
      user: {
        userId: 1, // 从登录获取实际用户ID
        token: 'valid_jwt_token' // 从登录获取的实际token
      }
    },
    
    // 登录方法示例
    // 登录方法示例
login() {
    wx.login({
      success: async res => {
        // 发送code到后端换取token
        const auth = await requestApi('/auth/login', 'POST', {
          code: res.code
        });
        
        wx.setStorageSync('token', auth.token);
        this.globalData.user = {
          userId: auth.userId,
          token: auth.token
        };
      }
    });
  }
  });