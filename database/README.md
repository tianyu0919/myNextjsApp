# 博客应用数据库结构

本目录包含博客应用的数据库相关文件，包括表结构定义、迁移脚本等。

## 数据库架构

我们使用PostgreSQL作为博客应用的数据库，设计了以下主要表结构：

1. **users** - 存储用户信息
2. **blog_posts** - 存储博客文章
3. **comments** - 存储文章评论
4. **tags** - 存储文章标签
5. **post_tags** - 文章和标签的多对多关联
6. **auth_sessions** - 存储认证会话信息
7. **post_likes** - 存储文章点赞信息
8. **access_logs** - 存储访问日志

## 快速开始

### 1. 安装依赖

首先确保你已经安装了PostgreSQL，然后安装Node.js依赖：

```bash
# 使用npm
npm install pg

# 或使用pnpm
pnpm install pg

# 安装类型声明
pnpm install -D @types/pg
```

### 2. 配置环境变量

复制`.env.example`文件并重命名为`.env.local`，然后根据你的PostgreSQL配置修改以下环境变量：

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=blog_app
```

### 3. 创建数据库

在PostgreSQL中创建数据库：

```bash
# 登录PostgreSQL
psql -U postgres

# 创建数据库
CREATE DATABASE blog_app;

# 退出
\q
```

### 4. 运行SQL脚本

执行`schema.sql`文件来创建表结构和初始化数据：

```bash
psql -U postgres -d blog_app -f database/schema.sql
```

### 5. 在应用中使用数据库

在你的Next.js应用中，你可以这样使用数据库连接：

```typescript
import { query } from '@/lib/db/database';

// 查询所有已发布的博客文章
export async function getPublishedPosts() {
  const result = await query(
    'SELECT * FROM blog_posts WHERE status = $1 ORDER BY published_at DESC',
    ['published']
  );
  return result.rows;
}

// 创建新博客文章
export async function createPost(title: string, content: string, authorId: string) {
  const result = await query(
    'INSERT INTO blog_posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
    [title, content, authorId]
  );
  return result.rows[0];
}
```

## 数据库模型

所有数据库模型的TypeScript接口定义都在`src/lib/db/models.ts`文件中，包括：

- User - 用户模型
- BlogPost - 博客文章模型
- Comment - 评论模型
- Tag - 标签模型
- 以及其他相关模型

## 数据库连接配置

`src/lib/db/database.ts`文件包含了数据库连接池的配置和辅助函数：

- `query()` - 执行SQL查询
- `getClient()` - 获取数据库客户端连接
- `transaction()` - 执行数据库事务
- `checkConnection()` - 检查数据库连接是否正常

## 索引优化

我们在以下字段上创建了索引以提高查询性能：

- blog_posts.author_id
- blog_posts.status
- blog_posts.published_at
- comments.post_id
- comments.user_id
- comments.parent_id
- post_tags.post_id
- post_tags.tag_id
- auth_sessions.token
- auth_sessions.user_id
- access_logs.user_id
- access_logs.path

## 自动更新时间戳

我们创建了触发器函数`update_updated_at_column`，用于在更新记录时自动更新`updated_at`字段。这个触发器应用于以下表：

- users
- blog_posts
- comments
- tags

## 注意事项

1. 生产环境中不要使用示例中的默认密码，请使用强密码并通过安全方式设置。
2. 定期备份数据库以防止数据丢失。
3. 在高流量环境中，可以根据实际情况调整连接池大小。
4. 考虑使用ORM工具（如Prisma、TypeORM等）来简化数据库操作。

## 进一步阅读

- [PostgreSQL官方文档](https://www.postgresql.org/docs/)
- [Node.js PostgreSQL客户端文档](https://node-postgres.com/)
- [Next.js环境变量文档](https://nextjs.org/docs/basic-features/environment-variables)