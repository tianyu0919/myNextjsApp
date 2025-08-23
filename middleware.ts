import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js 中间件
 * 处理全局状态码、错误处理和响应标准化
 */
export function middleware(request: NextRequest) {
  // 获取请求路径
  const path = request.nextUrl.pathname
  
  // 记录请求信息
  console.log(`[${new Date().toISOString()}] ${request.method} ${path}`)
  
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
