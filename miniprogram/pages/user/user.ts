// pages/user/user.js
Page({
    data: {
      avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0', // 默认头像
      nickname: ''
    },
  
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail
      this.setData({ avatarUrl })
    },
  
    onNicknameInput(e) {
      this.setData({ nickname: e.detail.value })
    },
  
    onSaveUserProfile() {
      // 这里你可以调用后端接口，保存 avatarUrl 和 nickname
      wx.showToast({ title: '保存成功' })
    }
  })
  