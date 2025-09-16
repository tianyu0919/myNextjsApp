/**
 * 登录API路由
 * 处理用户登录请求并设置认证状态
 */
import { NextRequest, NextResponse } from 'next/server';
import { withApiMiddleware } from '@/lib/api-middleware';
import { HttpStatus, ErrorMessages } from '@/lib/api-response';
import { validateCredentials, generateAuthToken, setAuthCookie, User } from '@/lib/auth';

/**
 * 登录请求体接口
 */
interface LoginRequest {
  username: string;
  password: string;
}

/**
 * 处理登录请求
 */
async function handleLogin(request: Request) {
  try {
    // 转换为NextRequest以访问json方法
    const nextRequest = request as NextRequest;
    
    // 解析请求体
    const body = await nextRequest.json() as LoginRequest;
    
    // 验证输入
    if (!body.username || !body.password) {
      return NextResponse.json(
        { success: false, error: ErrorMessages.VALIDATION_ERROR, message: '用户名和密码为必填项', timestamp: new Date().toISOString() },
        { status: HttpStatus.BAD_REQUEST, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 验证用户凭据
    const user = validateCredentials(body.username, body.password);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: ErrorMessages.UNAUTHORIZED, message: '用户名或密码错误', timestamp: new Date().toISOString() },
        { status: HttpStatus.UNAUTHORIZED, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 生成认证令牌
    const authToken = generateAuthToken();
    
    // 创建响应对象
    const responseBody = {
      success: true,
      data: { user, token: authToken },
      message: '登录成功',
      timestamp: new Date().toISOString()
    };
    
    const response = NextResponse.json(responseBody, {
      status: HttpStatus.OK,
      headers: { 'Content-Type': 'application/json' }
    });
    
    // 设置认证cookie
    setAuthCookie(response, authToken, user.id);
    
    return response;
  } catch (error) {
    console.error('登录失败:', error);
    
    return NextResponse.json(
      { success: false, error: ErrorMessages.INTERNAL_ERROR, message: '登录过程中发生错误，请重试', timestamp: new Date().toISOString() },
      { status: HttpStatus.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * 处理退出登录请求
 */
async function handleLogout() {
  try {
    // 创建响应对象
    const responseBody = {
      success: true,
      data: null,
      message: '退出登录成功',
      timestamp: new Date().toISOString()
    };
    
    const response = NextResponse.json(responseBody, {
      status: HttpStatus.OK,
      headers: { 'Content-Type': 'application/json' }
    });
    
    // 清除认证cookie
    response.cookies.delete('auth_token');
    response.cookies.delete('user_id');
    
    return response;
  } catch (error) {
    console.error('退出登录失败:', error);
    
    return NextResponse.json(
      { success: false, error: ErrorMessages.INTERNAL_ERROR, message: '退出登录过程中发生错误', timestamp: new Date().toISOString() },
      { status: HttpStatus.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// 使用API中间件包装处理函数
export const POST = withApiMiddleware(handleLogin);
export const GET = withApiMiddleware(handleLogout);