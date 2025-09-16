/**
 * 数据库连接检查API路由
 * 提供数据库连接状态和用户表数据查询功能
 */

import { withApiMiddleware } from '@/lib/api-middleware';
import { wrapResponse, HttpStatus, ErrorMessages } from '@/lib/api-response';
import { query } from '@/lib/db/database';

/**
 * 检查数据库连接状态并获取用户列表
 */
async function checkDatabaseConnection() {
  try {
    // 测试数据库连接
    await query('SELECT 1');
    
    // 查询用户表数据（只获取安全的字段）
    const usersResult = await query(
      'SELECT id, username, email, role, created_at AS "createdAt" FROM users'
    );
    
    // 构建响应数据
    const data = {
      connected: true,
      users: usersResult.rows,
      userCount: usersResult.rows.length,
      timestamp: new Date().toISOString()
    };
    
    return wrapResponse.success(data, '数据库连接成功', HttpStatus.OK);
  } catch (error) {
    console.error('数据库连接检查失败:', error);
    
    // 构建错误响应
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return wrapResponse.error(
      ErrorMessages.INTERNAL_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
      `数据库连接失败: ${errorMessage}`
    );
  }
}

/**
 * 测试特定的数据库操作
 */
async function testDatabaseOperation(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    
    // 根据请求体中的操作类型执行不同的测试
    switch (body.operation) {
      case 'count':
        // 测试计数操作
        const countResult = await query('SELECT COUNT(*) FROM users');
        return wrapResponse.success(
          { count: parseInt(countResult.rows[0].count) },
          '计数操作成功'
        );
        
      case 'recent':
        // 测试获取最近的用户
        const recentResult = await query(
          'SELECT id, username, created_at AS "createdAt" FROM users ORDER BY created_at DESC LIMIT 5'
        );
        return wrapResponse.success(
          { recentUsers: recentResult.rows },
          '获取最近用户成功'
        );
        
      default:
        return wrapResponse.error(
          ErrorMessages.VALIDATION_ERROR,
          HttpStatus.BAD_REQUEST,
          '不支持的操作类型。可用操作: count, recent'
        );
    }
  } catch (error) {
    console.error('数据库操作测试失败:', error);
    return wrapResponse.error(
      ErrorMessages.INTERNAL_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
      '数据库操作测试失败'
    );
  }
}

/**
 * 主请求处理器
 */
async function handleRequest(request: Request) {
  if (request.method === 'GET') {
    return checkDatabaseConnection();
  } else if (request.method === 'POST') {
    return testDatabaseOperation(request);
  } else {
    return wrapResponse.error(
      ErrorMessages.METHOD_NOT_ALLOWED,
      HttpStatus.METHOD_NOT_ALLOWED,
      `不支持的HTTP方法: ${request.method}`
    );
  }
}

// 使用中间件包装处理函数
export const GET = withApiMiddleware(handleRequest);
export const POST = withApiMiddleware(handleRequest);
export const OPTIONS = withApiMiddleware(handleRequest);