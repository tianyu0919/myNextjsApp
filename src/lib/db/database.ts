// PostgreSQL数据库连接配置

import { Pool, PoolClient, QueryResult } from 'pg';

// 在Next.js中，环境变量会自动从.env文件加载，无需额外配置


console.log(process.env)
// 创建数据库连接池
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'blog_app',
  max: 20, // 连接池中的最大连接数
  idleTimeoutMillis: 30000, // 空闲连接超时时间（毫秒）
  connectionTimeoutMillis: 2000, // 连接超时时间（毫秒）
});

// 监听连接池事件
pool.on('connect', (client) => {
  console.log('新的数据库客户端已连接');
});

pool.on('error', (err) => {
  console.error('数据库连接池发生错误:', err);
});

pool.on('remove', (client) => {
  console.log('数据库客户端已从连接池中移除');
});

/**
 * 执行SQL查询
 * @param text SQL查询语句
 * @param params 查询参数
 * @returns 查询结果
 */
export async function query(text: string, params?: any[]): Promise<QueryResult> {
  const start = Date.now();
  
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // 日志记录（可以根据环境变量控制是否记录）
    if (process.env.NODE_ENV !== 'production' || process.env.DB_LOGGING === 'true') {
      console.log('执行查询', {
        text,
        params,
        duration,
        rows: res.rowCount
      });
    }
    
    return res;
  } catch (error) {
    const duration = Date.now() - start;
    console.error('数据库查询失败', {
      text,
      params,
      duration,
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

/**
 * 获取数据库客户端连接
 * 用于需要在单个连接中执行多个查询的场景（如事务）
 * @returns 数据库客户端连接
 */
export async function getClient(): Promise<PoolClient> {
  const client = await pool.connect();
  
  // 记录客户端连接的使用情况
  const startTime = Date.now();
  const logger = (msg: string) => {
    console.log('客户端使用情况', {
      duration: Date.now() - startTime,
      message: msg
    });
  };
  
  // 创建一个包装的客户端对象，保持原始方法不变
  const wrappedClient = {
    ...client,
    query: async (text: string, params?: any[]): Promise<QueryResult> => {
      if (process.env.NODE_ENV !== 'production' || process.env.DB_LOGGING === 'true') {
        logger(`执行SQL: ${text}`);
      }
      return client.query(text, params);
    },
    release: (): void => {
      logger('释放客户端连接');
      client.release();
    }
  };
  
  return wrappedClient as PoolClient;
}

/**
 * 执行数据库事务
 * @param callback 在事务中执行的回调函数
 * @returns 事务执行结果
 */
export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    const result = await callback(client);
    
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * 检查数据库连接是否正常
 * @returns 是否连接成功
 */
export async function checkConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    console.log('数据库连接成功');
    return true;
  } catch (error) {
    console.error('数据库连接失败:', error);
    return false;
  }
}

/**
 * 关闭数据库连接池
 */
export async function closePool(): Promise<void> {
  await pool.end();
  console.log('数据库连接池已关闭');
}

// 导出连接池，以便在需要时直接使用
// 但通常建议使用上面的query或getClient函数来执行查询
export default pool;

// 自动检查数据库连接
if (process.env.NODE_ENV !== 'test') {
  checkConnection();
}