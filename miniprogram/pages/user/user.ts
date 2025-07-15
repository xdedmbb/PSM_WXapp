const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    nickname: ''
  },

  onLoad() {
    const user = wx.getStorageSync('user')
    if (user && user.userId) {
      // 已登录，自动展示头像和昵称
      this.setData({
        avatarUrl: user.avatarUrl || defaultAvatarUrl,
        nickname: user.nickname || ''
      })
    }
  },

  // 授权 + 后端保存
  onAuthorizeUser() {
    const self = this

    // 如果已登录就不重复授权
    const user = wx.getStorageSync('user')
    if (user && user.userId) return

    // 微信授权获取头像 + 昵称
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const { avatarUrl, nickName } = res.userInfo

        // 调用 wx.login 拿 code
        wx.login({
          success: (loginRes) => {
            const code = loginRes.code

            // 调用后端 wxLogin 接口
            wx.request({
              url: 'http://192.168.1.71:9663/api/user/wxLogin',
              method: 'POST',
              data: {
                code: code,
                nickname: nickName,
                avatarUrl: avatarUrl
              },
              success: (resp) => {
                const userData = resp.data
                wx.setStorageSync('user', userData)

                self.setData({
                  avatarUrl: userData.avatarUrl,
                  nickname: userData.nickname
                })

                wx.showToast({ title: '登录成功' })
              },
              fail: () => {
                wx.showToast({ title: '登录失败', icon: 'error' })
              }
            })
          }
        })
      },
      fail: () => {
        wx.showToast({ title: '未授权', icon: 'none' })
      }
    })
  }
})
