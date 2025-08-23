/**
 * API 中间件使用示例
 * 展示如何在不同场景下使用状态码中间件
 */

import { withApiMiddleware, withCustomMiddleware } from './api-middleware';
import { wrapResponse, HttpStatus, ErrorMessages } from './api-response';

// ========================================
// 示例1: 基本使用 - 用户管理 API
// ========================================

/**
 * 获取用户列表
 */
async function getUsersHandler(request: Request) {
  // 模拟获取用户数据
  const users = [
    { id: 1, name: '张三', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', email: 'lisi@example.com' }
  ];

  return wrapResponse.success(users, '获取用户列表成功');
}

/**
 * 创建用户
 */
async function createUserHandler(request: Request) {
  try {
    const body = await request.json();
    
    // 简单验证
    if (!body.name || !body.email) {
      return wrapResponse.error(
        ErrorMessages.VALIDATION_ERROR,
        HttpStatus.BAD_REQUEST,
        '姓名和邮箱为必填项'
      );
    }

    // 模拟创建用户
    const newUser = {
      id: Date.now(),
      name: body.name,
      email: body.email,
      createdAt: new Date().toISOString()
    };

    return wrapResponse.success(newUser, '用户创建成功', HttpStatus.CREATED);
    
  } catch (error) {
    return wrapResponse.error(
      ErrorMessages.VALIDATION_ERROR,
      HttpStatus.BAD_REQUEST,
      '请求数据格式错误'
    );
  }
}

// 使用默认中间件包装
export const getUsers = withApiMiddleware(getUsersHandler);
export const createUser = withApiMiddleware(createUserHandler);

// ========================================
// 示例2: 自定义配置 - 高频率 API
// ========================================

// 为高频率访问的 API 创建特殊配置
const highTrafficMiddleware = withCustomMiddleware({
  enableLogging: false, // 关闭日志以提高性能
  enableErrorHandling: true,
  enableCors: true,
  rateLimit: {
    windowMs: 60000, // 1分钟
    maxRequests: 1000 // 更高的限制
  }
});

/**
 * 健康检查接口
 */
async function healthCheckHandler(request: Request) {
  return wrapResponse.success({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  }, '服务运行正常');
}

export const healthCheck = highTrafficMiddleware(healthCheckHandler);

// ========================================
// 示例3: 分页数据 API
// ========================================

/**
 * 获取博客文章列表（分页）
 */
async function getBlogPostsHandler(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');

  // 模拟数据
  const mockPosts = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `博客文章 ${i + 1}`,
    content: `这是第 ${i + 1} 篇文章的内容`,
    author: '作者' + (i % 5 + 1),
    createdAt: new Date(Date.now() - i * 86400000).toISOString()
  }));

  // 分页逻辑
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPosts = mockPosts.slice(startIndex, endIndex);

  return wrapResponse.paginated(
    paginatedPosts,
    page,
    pageSize,
    mockPosts.length,
    '获取博客列表成功'
  );
}

export const getBlogPosts = withApiMiddleware(getBlogPostsHandler);

// ========================================
// 示例4: 错误处理演示
// ========================================

/**
 * 演示各种错误情况
 */
async function errorDemoHandler(request: Request) {
  const url = new URL(request.url);
  const errorType = url.searchParams.get('type');

  switch (errorType) {
    case 'validation':
      return wrapResponse.error(
        ErrorMessages.VALIDATION_ERROR,
        HttpStatus.BAD_REQUEST,
        '数据验证失败示例'
      );
      
    case 'unauthorized':
      return wrapResponse.error(
        ErrorMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
        '请先登录'
      );
      
    case 'forbidden':
      return wrapResponse.error(
        ErrorMessages.FORBIDDEN,
        HttpStatus.FORBIDDEN,
        '权限不足'
      );
      
    case 'notfound':
      return wrapResponse.error(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND,
        '请求的资源不存在'
      );
      
    case 'server':
      return wrapResponse.error(
        ErrorMessages.INTERNAL_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
        '服务器内部错误示例'
      );
      
    default:
      return wrapResponse.success({
        message: '错误演示 API',
        availableTypes: ['validation', 'unauthorized', 'forbidden', 'notfound', 'server']
      }, '请使用 ?type=错误类型 参数测试不同错误');
  }
}

export const errorDemo = withApiMiddleware(errorDemoHandler);

// ========================================
// 使用方法说明
// ========================================

/*
在 app/api/[...] 路由文件中使用：

// app/api/users/route.ts
import { getUsers, createUser } from '@/lib/api-example';

export const GET = getUsers;
export const POST = createUser;

// app/api/health/route.ts
import { healthCheck } from '@/lib/api-example';

export const GET = healthCheck;

// app/api/posts/route.ts
import { getBlogPosts } from '@/lib/api-example';

export const GET = getBlogPosts;

// app/api/error-demo/route.ts
import { errorDemo } from '@/lib/api-example';

export const GET = errorDemo;

测试命令：
curl http://localhost:3000/api/users
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"name":"张三","email":"zhang@example.com"}'
curl http://localhost:3000/api/posts?page=2&pageSize=5
curl http://localhost:3000/api/error-demo?type=validation
*/
