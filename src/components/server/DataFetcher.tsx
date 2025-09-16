/**
 * 数据获取组件 - 服务端组件
 * 用于在服务器端获取各种数据
 */

import React from 'react';
import { query } from '@/lib/db/database';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface DatabaseStatusData {
  connected: boolean;
  users: User[];
  userCount: number;
  error: string | null;
  statusMessage: string;
}

/**
 * 检查数据库连接并获取用户列表
 * 这个函数在服务器端执行
 */
export async function getDatabaseStatus(): Promise<DatabaseStatusData> {
  try {
    // 直接在服务器端查询数据库
    const usersResult = await query<{ 
      id: string;
      username: string;
      email: string;
      role: string;
      createdAt: string;
    }>('SELECT id, username, email, role, created_at AS "createdAt" FROM users');
    
    const users: User[] = usersResult.rows;
    
    return {
      connected: true,
      users,
      userCount: users.length,
      error: null,
      statusMessage: users.length > 0
        ? `数据库连接成功！共找到 ${users.length} 个用户。`
        : '数据库连接成功，但users表为空'
    };
  } catch (error) {
    console.error('数据库连接检查失败:', error);
    
    return {
      connected: false,
      users: [],
      userCount: 0,
      error: error instanceof Error ? error.message : String(error),
      statusMessage: '数据库连接失败'
    };
  }
}

/**
 * 数据获取器组件
 * 用于在服务器端获取数据并将其传递给子组件
 */
interface DataFetcherProps {
  children: (data: DatabaseStatusData) => React.ReactNode;
}

async function DataFetcher({ children }: DataFetcherProps) {
  const data = await getDatabaseStatus();
  return children(data);
}

export default DataFetcher;