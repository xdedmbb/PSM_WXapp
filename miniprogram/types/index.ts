// 用户信息类型
export interface UserInfo {
    userId: number;
    username: string;
    // 可以根据实际返回的用户信息添加其他字段
  }
  
  // 登录请求参数类型
  export interface LoginParams {
    username: string;
    password: string;
  }
  
  // 登录响应类型
  export interface LoginResponse {
    code: number;
    message: string;
    data: {
      user: UserInfo;
      // 如果有token可以在这里添加
      // token: string;
    };
  }
  