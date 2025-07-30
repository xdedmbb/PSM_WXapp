// utils/api.ts
import { request } from './request';

// 确认服务器地址，替换为实际API地址
const BASE_URL = 'http://localhost:9663/api/tasks'; // 假设后端服务运行在本地9663端口

export async function requestApi(url, method = 'GET', data) {
  try {
    // 获取token（如果有）
    const token = wx.getStorageSync('token') || '';
    
    // 构建请求头
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 发送请求
    const res = await request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: headers
    });
    
    // 检查响应状态码
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const responseData = res.data;
      if (method === 'GET') {
        // GET请求期望返回数组
        if (Array.isArray(responseData)) {
          return responseData;
        } else {
          throw new Error('响应数据格式不正确，期望是数组类型');
        }
      } else {
        // POST、PUT、DELETE请求返回通用结果
        return responseData;
      }
    } else {
      // 解析错误信息
      let errorMsg = `请求失败: ${res.statusCode}`;
      if (res.data && res.data.message) {
        errorMsg = res.data.message;
      } else if (res.errMsg) {
        errorMsg = res.errMsg;
      }
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('API请求错误:', error);
    wx.showToast({
      title: error.message || '请求失败',
      icon: 'none'
    });
    throw error;
  }
}
// 新增 Dify API 请求函数
// 修改后的callDifyAPI函数，使用普通HTTP请求
export async function callDifyAPI(inputText: string): Promise<string> {
  const apiUrl = 'http://192.168.13.58/v1/chat-messages';
  const apiKey = 'app-7BugNGRTqg7DR7oASsUj8u6P';

  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: {
        inputs: {},
        // 关键修改：从streaming改为blocking模式
        response_mode: "blocking",
        conversation_id: "",
        user: "abc-123",
        query: inputText,
        model: "llama3", 
      },
      success: (res) => {
        if (res.statusCode === 200) {
          // Dify API在blocking模式下直接返回完整的JSON响应
          const responseData = res.data as any;
          if (responseData && responseData.answer) {
            resolve(responseData.answer);
          } else {
            reject(new Error('无法解析API响应'));
          }
        } else {
          const error = new Error(res.data?.message || `API错误 (${res.statusCode})`);
          reject(error);
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
}