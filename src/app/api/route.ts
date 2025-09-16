/**
 * API 路由处理器
 * 使用中间件系统处理 /api 路径下的各种 HTTP 请求
 */

import { withApiMiddleware } from '@/lib/api-middleware';
import { wrapResponse, HttpStatus, ErrorMessages } from '@/lib/api-response';

/**
 * GET 请求处理器
 * 返回简单的问候信息
 */
async function handleGet() {
  const data = {
    message: "Hello, world!",
    timestamp: new Date().toISOString(),
    method: "GET"
  };

  return wrapResponse.success(data, "获取数据成功", HttpStatus.OK);
}

/**
 * POST 请求处理器
 * 处理 POST 请求并返回响应
 */
async function handlePost(request: Request) {
  try {
    // 解析请求体
    const body = await request.json().catch(() => ({}));
    
    // 构建响应数据
    const data = {
      message: "POST request received",
      receivedData: body,
      timestamp: new Date().toISOString(),
      method: "POST"
    };

    return wrapResponse.success(data, "数据创建成功", HttpStatus.CREATED);
  } catch {
    return wrapResponse.error(
      ErrorMessages.VALIDATION_ERROR,
      HttpStatus.BAD_REQUEST,
      "请求数据格式错误"
    );
  }
}

/**
 * PUT 请求处理器
 * 处理 PUT 请求并返回响应
 */
async function handlePut(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    
    const data = {
      message: "PUT request received",
      receivedData: body,
      timestamp: new Date().toISOString(),
      method: "PUT"
    };

    return wrapResponse.success(data, "数据更新成功", HttpStatus.OK);
  } catch {
    return wrapResponse.error(
      ErrorMessages.VALIDATION_ERROR,
      HttpStatus.BAD_REQUEST,
      "请求数据格式错误"
    );
  }
}

/**
 * DELETE 请求处理器
 * 处理 DELETE 请求并返回响应
 */
async function handleDelete() {
  const data = {
    message: "DELETE request received",
    timestamp: new Date().toISOString(),
    method: "DELETE"
  };

  return wrapResponse.success(data, "数据删除成功", HttpStatus.OK);
}

/**
 * PATCH 请求处理器
 * 处理 PATCH 请求并返回响应
 */
async function handlePatch(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    
    const data = {
      message: "PATCH request received",
      receivedData: body,
      timestamp: new Date().toISOString(),
      method: "PATCH"
    };

    return wrapResponse.success(data, "数据部分更新成功", HttpStatus.OK);
  } catch {
    return wrapResponse.error(
      ErrorMessages.VALIDATION_ERROR,
      HttpStatus.BAD_REQUEST,
      "请求数据格式错误"
    );
  }
}

/**
 * 主请求处理器
 * 根据 HTTP 方法分发到相应的处理函数
 */
async function handleRequest(request: Request) {
  const method = request.method.toUpperCase();

  switch (method) {
    case 'GET':
      return handleGet();
    case 'POST':
      return handlePost(request);
    case 'PUT':
      return handlePut(request);
    case 'DELETE':
      return handleDelete();
    case 'PATCH':
      return handlePatch(request);
    case 'HEAD':
      return new Response(null, { status: HttpStatus.OK });
    default:
      return wrapResponse.error(
        ErrorMessages.METHOD_NOT_ALLOWED,
        HttpStatus.METHOD_NOT_ALLOWED,
        `不支持的 HTTP 方法: ${method}`
      );
  }
}

// 使用中间件包装主处理函数
const handlerWithMiddleware = withApiMiddleware(handleRequest);

// 导出处理函数
export const GET = handlerWithMiddleware;
export const POST = handlerWithMiddleware;
export const PUT = handlerWithMiddleware;
export const DELETE = handlerWithMiddleware;
export const PATCH = handlerWithMiddleware;
export const HEAD = handlerWithMiddleware;
export const OPTIONS = handlerWithMiddleware;