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
  
  // 获取用户任务列表
  export const getUserTasks = (userId: number, date?: string) => {
    let url = `/api/tasks/user/${userId}`;
    
    // 如果有日期参数，添加到URL
    if (date) {
      url += `?date=${date}`;
    }
    
    return request(url, 'GET');
  };
  