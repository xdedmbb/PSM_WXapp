Page({
    data: {
      isLoading: false
    },
  
    onLogin() {
      this.setData({ isLoading: true })
  
      wx.getUserProfile({
        desc: '用于完善用户信息',
        success: profileRes => {
          const { nickName, avatarUrl } = profileRes.userInfo
  
          wx.login({
            success: res => {
              const code = res.code
              if (!code) {
                wx.showToast({ title: '获取code失败', icon: 'none' })
                this.setData({ isLoading: false })
                return
              }
  
              wx.request({
                url: 'http://192.168.1.71:9663/api/user/wxLogin',
                method: 'POST',
                data: {
                  code,
                  nickname: nickName,
                  avatarUrl
                },
                success: (res) => {
                  if (res.data && res.data.code === 200 && res.data.data) {
                    const { token, user } = res.data.data
                    if (token) {
                      wx.setStorageSync('token', token)
                    } else {
                      wx.removeStorageSync('token')
                    }
                    if (user) {
                      wx.setStorageSync('user', user)
                    }
                    wx.showToast({ title: '登录成功' })
                    wx.switchTab({ url: '/pages/dashboard/dashboard' })
                  } else {
                    wx.removeStorageSync('token')
                    wx.showToast({ title: (res.data && res.data.message) ? res.data.message : '登录失败'
                    , icon: 'none' })
                  }
                },
                fail: () => {
                  wx.removeStorageSync('token')
                  wx.showToast({ title: '登录失败', icon: 'error' })
                },
                complete: () => {
                  this.setData({ isLoading: false })
                }
              })
            },
            fail: () => {
              wx.showToast({ title: '获取登录凭证失败', icon: 'none' })
              this.setData({ isLoading: false })
            }
          })
        },
        fail: () => {
          wx.showToast({ title: '用户拒绝授权', icon: 'none' })
          this.setData({ isLoading: false })
        }
      })
    }
  })
  