Page({
    data: {
      user: {
        avatarUrl: wx.getStorageSync('user')?.avatarUrl || '',
        nickname: wx.getStorageSync('user')?.nickname || '未登录'
      }
    },
    logout() {
      wx.clearStorage()
      wx.reLaunch({ url: '/pages/login/login' })
    }
  })
  