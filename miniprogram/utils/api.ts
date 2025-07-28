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