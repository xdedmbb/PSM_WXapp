// 修改request.ts中的请求基础配置
const BASE_URL = 'http://localhost:9663'; // 例如 'http://localhost:3000' 或线上域名
export const request = (url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data: any = {}) => {
    // 拼接完整URL
    const fullUrl = BASE_URL + url;
    
    return new Promise((resolve, reject) => {
      wx.request({
        url: fullUrl, // 使用拼接后的完整URL
        method: method,
        data: data,
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
            if (res.statusCode === 200) {
              resolve(res.data);
            } else {
              reject(new Error(`请求失败，状态码: ${res.statusCode}`));
            }
          },
          fail: (err) => {
            reject(err);
          }
      });
    });
  };