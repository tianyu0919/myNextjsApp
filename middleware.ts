import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js 中间件
 * 处理全局状态码、错误处理、响应标准化和用户认证
 */
export function middleware(request: NextRequest) {
  // 获取请求路径
  const path = request.nextUrl.pathname
  
  // 记录请求信息
  console.log(`[${new Date().toISOString()}] ${request.method} ${path}`)
  
  // 公开路径，不需要认证
  const publicPaths = ['/login', '/api/login'];
  
  // 检查是否为公开路径
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(`${publicPath}/`)
  );
  
  // 检查认证状态
  const authToken = request.cookies.get('auth_token')?.value;
  const userId = request.cookies.get('user_id')?.value;
  const isAuthenticated = !!authToken && !!userId;
  
  // 如果不是公开路径且未登录，重定向到登录页面
  if (!isPublicPath && !isAuthenticated) {
    console.log(`未登录用户尝试访问受保护路径: ${path}，重定向到登录页面`);
    
    // 保存原始访问路径，登录后可以重定向回来
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    
    return NextResponse.redirect(loginUrl);
  }
  
  // 继续处理请求
  const response = NextResponse.next()
  
  // 添加通用响应头
  response.headers.set('X-Request-ID', generateRequestId())
  response.headers.set('X-Response-Time', Date.now().toString())
  
  return response
}

/**
 * 生成请求ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 配置中间件匹配的路径
 */
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以下路径：
     * - api (API 路由)
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (网站图标)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
