/**
 * API 中间件装饰器
 * 提供统一的错误处理、日志记录和响应格式化
 */

import { wrapResponse, HttpStatus, ErrorMessages } from './api-response';

/**
 * API 处理函数类型
 */
export type ApiHandler = (request: Request) => Promise<Response>;

/**
 * 中间件配置接口
 */
export interface MiddlewareConfig {
  enableLogging?: boolean;
  enableErrorHandling?: boolean;
  enableCors?: boolean;
  rateLimit?: {
    windowMs: number;
    maxRequests: number;
  };
}

/**
 * 默认中间件配置
 */
const defaultConfig: MiddlewareConfig = {
  enableLogging: true,
  enableErrorHandling: true,
  enableCors: true,
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15分钟
    maxRequests: 100
  }
};

/**
 * 请求缓存存储
 */
const requestCache = new Map<string, { count: number; resetTime: number }>();

/**
 * 创建 API 中间件
 */
export function createApiMiddleware(config: MiddlewareConfig = {}) {
  const finalConfig = { ...defaultConfig, ...config };

  return function withMiddleware(handler: ApiHandler): ApiHandler {
    return async (request: Request) => {
      const startTime = Date.now();
      const requestId = generateRequestId();
      
      try {
        // 1. 请求日志记录
        if (finalConfig.enableLogging) {
          console.log(`[${new Date().toISOString()}] [${requestId}] ${request.method} ${request.url}`);
        }

        // 2. 速率限制检查
        if (finalConfig.rateLimit) {
          const clientId = getClientId(request);
          const isRateLimited = checkRateLimit(clientId, finalConfig.rateLimit);
          
          if (isRateLimited) {
            return wrapResponse.error(
              ErrorMessages.RATE_LIMIT_EXCEEDED,
              HttpStatus.TOO_MANY_REQUESTS,
              '请求频率过高，请稍后再试'
            );
          }
        }

        // 3. CORS 预检请求处理
        if (request.method === 'OPTIONS' && finalConfig.enableCors) {
          return new Response(null, {
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID',
              'Access-Control-Max-Age': '86400'
            }
          });
        }

        // 4. 执行原始处理函数
        const response = await handler(request);

        // 5. 添加响应头
        const enhancedResponse = new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: {
            ...Object.fromEntries(response.headers.entries()),
            'X-Request-ID': requestId,
            'X-Response-Time': `${Date.now() - startTime}ms`
          }
        });

        // 6. 响应日志记录
        if (finalConfig.enableLogging) {
          console.log(`[${new Date().toISOString()}] [${requestId}] ${request.method} ${request.url} - ${response.status} (${Date.now() - startTime}ms)`);
        }

        return enhancedResponse;

      } catch (error) {
        // 7. 错误处理
        if (finalConfig.enableErrorHandling) {
          console.error(`[${new Date().toISOString()}] [${requestId}] Error:`, error);
          
          return wrapResponse.error(
            ErrorMessages.INTERNAL_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR,
            '服务器内部错误'
          );
        }
        
        throw error;
      }
    };
  };
}

/**
 * 生成请求ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 获取客户端标识
 */
function getClientId(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return `${forwarded || realIp || 'unknown'}_${userAgent}`;
}

/**
 * 检查速率限制
 */
function checkRateLimit(clientId: string, config: { windowMs: number; maxRequests: number }): boolean {
  const now = Date.now();
  const cached = requestCache.get(clientId);

  if (!cached || now > cached.resetTime) {
    // 重置计数器
    requestCache.set(clientId, {
      count: 1,
      resetTime: now + config.windowMs
    });
    return false;
  }

  if (cached.count >= config.maxRequests) {
    return true;
  }

  // 增加计数器
  cached.count++;
  return false;
}

/**
 * 清理过期的缓存条目
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCache.entries()) {
    if (now > value.resetTime) {
      requestCache.delete(key);
    }
  }
}, 60000); // 每分钟清理一次

/**
 * 便捷的中间件装饰器
 */
export const withApiMiddleware = createApiMiddleware();

/**
 * 带配置的中间件装饰器
 */
export const withCustomMiddleware = createApiMiddleware;
