// pages/login/login.ts
Page({
    data: {
      isLoading: false
    },
  
    onLoad() {
      console.log("登录页面加载")
    },
  
    onGetUserInfo() {
      this.setData({ isLoading: true })
  
      wx.login({
        success: res => {
          const code = res.code
          if (!code) {
            wx.showToast({ title: '获取登录凭证失败', icon: 'none' })
            return
          }
          console.log("code:"+code)
          wx.request({
            url: 'http://localhost:9663/api/user/wxLogin',
            method: 'POST',
            data: { code },
            success: res => {
              const { token, user } = res.data.data
              wx.setStorageSync('token', token)
              wx.setStorageSync('user', user)
              wx.showToast({ title: '登录成功' })
              wx.switchTab({ url: '/pages/dashboard/dashboard' }) // 跳转首页
            },
            fail: () => {
              wx.showToast({ title: '登录失败', icon: 'none' })
            },
            complete: () => {
              this.setData({ isLoading: false })
            }
          })
        }
      })
    }
  })
  