// utils/request.ts
export function request(options: WechatMiniprogram.RequestOption): Promise<WechatMiniprogram.RequestSuccessCallbackResult> {
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        success: (res) => resolve(res),
        fail: (err) => reject(err),
      });
    });
  }
  