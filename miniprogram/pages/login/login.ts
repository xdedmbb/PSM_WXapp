Page({
    data: {
      isLoading: false
    },
  
    onLoad() {
      console.log("登录页面加载")
    },
  
    onGetUserInfo() {
      this.setData({ isLoading: true })
  
      // Step 1：获取用户头像与昵称
      wx.getUserProfile({
        desc: '用于完善用户信息',
        success: profileRes => {
          const { nickName, avatarUrl } = profileRes.userInfo
  
          // Step 2：获取微信 code
          wx.login({
            success: res => {
              const code = res.code
              if (!code) {
                wx.showToast({ title: '获取登录凭证失败', icon: 'none' })
                this.setData({ isLoading: false })
                return
              }
  
              console.log("code:", code)
              console.log("昵称:", nickName)
              console.log("头像:", avatarUrl)
  
              // Step 3：发送到后端
              wx.request({
                url: 'http://192.168.1.71:9663/api/user/wxLogin',
                // 192.168.1.71/localhost
                method: 'POST',
                data: {
                  code,
                  nickname: nickName,
                  avatarUrl: avatarUrl
                },
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
            },
            fail: () => {
              wx.showToast({ title: '获取code失败', icon: 'none' })
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
  