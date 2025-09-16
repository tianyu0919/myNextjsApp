/**
 * API 响应工具类
 * 提供标准化的 API 响应格式和状态码处理
 */

/**
 * 标准 API 响应接口
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  msg?: string;
  timestamp: string;
  requestId?: string;
  code: number;
}

/**
 * 成功响应构建器
 */
export class ApiResponseBuilder {
  /**
   * 构建成功响应
   */
  static success<T>(data: T, message?: string, statusCode: number = 200): Response {
    const response: ApiResponse<T> = {
      data,
      msg: message || '操作成功',
      timestamp: new Date().toISOString(),
      code: statusCode
    };

    return new Response(JSON.stringify(response), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  }

  /**
   * 构建错误响应
   */
  static error(error: string, statusCode: number = 500, message?: string): Response {
    const response: ApiResponse = {
      error,
      msg: message || '操作失败',
      timestamp: new Date().toISOString(),
      code: statusCode
    };

    return new Response(JSON.stringify(response), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * 构建分页响应
   */
  static paginated<T>(
    data: T[],
    page: number,
    pageSize: number,
    total: number,
    message?: string
  ): Response {
    const totalPages = Math.ceil(total / pageSize);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    const response: ApiResponse<{
      data: T[];
      pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }> = {
      data: {
        data,
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
          hasNext,
          hasPrev
        }
      },
      msg: message || '获取数据成功',
      timestamp: new Date().toISOString(),
      code: HttpStatus.OK
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatus.OK,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  }
}

/**
 * HTTP 状态码常量
 */
export const HttpStatus = {
  // 成功状态码
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // 重定向状态码
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,

  // 客户端错误状态码
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // 服务器错误状态码
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const;

/**
 * 常用错误消息
 */
export const ErrorMessages = {
  INVALID_REQUEST: '无效的请求',
  UNAUTHORIZED: '未授权访问',
  FORBIDDEN: '禁止访问',
  NOT_FOUND: '资源不存在',
  METHOD_NOT_ALLOWED: '不支持的请求方法',
  INTERNAL_ERROR: '服务器内部错误',
  VALIDATION_ERROR: '数据验证失败',
  RATE_LIMIT_EXCEEDED: '请求频率过高',
  DATABASE_ERROR: '数据库操作失败',
  NETWORK_ERROR: '网络连接错误'
} as const;

/**
 * 响应包装器函数
 */
export const wrapResponse = {
  /**
   * 包装成功响应
   */
  success: <T>(data: T, message?: string, statusCode: number = HttpStatus.OK) => 
    ApiResponseBuilder.success(data, message, statusCode),

  /**
   * 包装错误响应
   */
  error: (error: string, statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR, message?: string) => 
    ApiResponseBuilder.error(error, statusCode, message),

  /**
   * 包装分页响应
   */
  paginated: <T>(data: T[], page: number, pageSize: number, total: number, message?: string) => 
    ApiResponseBuilder.paginated(data, page, pageSize, total, message)
};
