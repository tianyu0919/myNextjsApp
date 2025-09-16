/**
 * 认证工具类
 * 提供用户登录状态管理、令牌处理等功能
 */
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { randomUUID } from 'crypto';

/**
 * 用户信息接口
 */
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

/**
 * 模拟用户数据库
 * 在实际项目中应连接真实数据库
 */
const mockUsers: Record<string, { username: string; password: string; email: string; role: string }> = {
  'admin': { username: 'admin', password: 'admin123', email: 'admin@example.com', role: 'admin' },
  'user': { username: 'user', password: 'user123', email: 'user@example.com', role: 'user' }
};

/**
 * 认证配置
 */
const AUTH_CONFIG = {
  COOKIE_NAME: 'auth_token',
  // 在实际项目中应使用环境变量配置这些值
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24小时
};

/**
 * 生成认证令牌
 */
export function generateAuthToken(): string {
  return randomUUID();
}

/**
 * 验证用户凭据
 */
export function validateCredentials(username: string, password: string): User | null {
  const user = mockUsers[username];
  
  if (user && user.password === password) {
    return {
      id: username,
      username: user.username,
      email: user.email,
      role: user.role
    };
  }
  
  return null;
}

/**
 * 设置认证cookie
 */
export function setAuthCookie(response: NextResponse, token: string, userId: string): void {
  const expires = new Date(Date.now() + AUTH_CONFIG.TOKEN_EXPIRY);
  
  response.cookies.set(AUTH_CONFIG.COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: AUTH_CONFIG.TOKEN_EXPIRY / 1000, // 转换为秒
    expires,
    path: '/',
  });
  
  // 存储用户ID以便后续验证
  response.cookies.set('user_id', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: AUTH_CONFIG.TOKEN_EXPIRY / 1000,
    expires,
    path: '/',
  });
}

/**
 * 清除认证cookie
 */
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.delete(AUTH_CONFIG.COOKIE_NAME);
  response.cookies.delete('user_id');
}

/**
 * 获取cookie存储
 */
async function getCookieStore(): Promise<ReadonlyRequestCookies | null> {
  try {
    // 在服务器组件和API路由中，cookies() 返回 Promise<ReadonlyRequestCookies>
    const cookieStore = await cookies();
    return cookieStore as ReadonlyRequestCookies;
  } catch (error) {
    // 在客户端组件中可能会抛出错误，返回null
    return null;
  }
}

/**
 * 检查用户是否已登录
 * 在服务器组件或API路由中使用
 */
export async function isUserLoggedIn(): Promise<boolean> {
  const cookieStore = await getCookieStore();
  if (!cookieStore) return false;
  
  const authToken = cookieStore.get(AUTH_CONFIG.COOKIE_NAME);
  const userId = cookieStore.get('user_id');
  
  // 简单验证：检查令牌和用户ID是否存在
  // 在实际项目中应验证令牌的有效性（如使用数据库或Redis存储有效令牌）
  return !!authToken && !!userId && mockUsers[userId.value] !== undefined;
}

/**
 * 获取当前登录用户
 * 在服务器组件或API路由中使用
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await getCookieStore();
  if (!cookieStore) return null;
  
  const userId = cookieStore.get('user_id');
  
  if (!userId || !mockUsers[userId.value]) {
    return null;
  }
  
  const user = mockUsers[userId.value];
  return {
    id: userId.value,
    username: user.username,
    email: user.email,
    role: user.role
  };
}

/**
 * 认证中间件工具
 * 用于检查请求的认证状态
 */
export function checkAuth(request: Request): { isAuthenticated: boolean; userId?: string } {
  const cookieHeader = request.headers.get('cookie') || '';
  
  // 解析cookie以获取认证信息
  const authCookieMatch = cookieHeader.match(new RegExp(`${AUTH_CONFIG.COOKIE_NAME}=([^;]+)`));
  const userIdCookieMatch = cookieHeader.match(/user_id=([^;]+)/);
  
  const authToken = authCookieMatch ? authCookieMatch[1] : '';
  const userId = userIdCookieMatch ? userIdCookieMatch[1] : '';
  
  // 简单验证
  const isAuthenticated = !!authToken && !!userId && mockUsers[userId] !== undefined;
  
  return {
    isAuthenticated,
    userId: isAuthenticated ? userId : undefined
  };
}