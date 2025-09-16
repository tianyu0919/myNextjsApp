-- Next.js博客应用数据库表结构设计
-- PostgreSQL版本

-- 1. 用户表
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,  -- 存储加密后的密码
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  avatar_url VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(username),
  UNIQUE(email)
);

-- 2. 博客文章表
CREATE TABLE blog_posts (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,  -- 用于URL
  author_id VARCHAR(36) NOT NULL,
  cover_image_url VARCHAR(255),
  read_time INTEGER,  -- 阅读时间（分钟）
  status VARCHAR(20) DEFAULT 'draft',  -- draft, published, archived
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. 评论表
CREATE TABLE comments (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  parent_id VARCHAR(36),  -- 用于嵌套评论
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_approved BOOLEAN DEFAULT true,
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- 4. 标签表
CREATE TABLE tags (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. 文章-标签关联表（多对多关系）
CREATE TABLE post_tags (
  post_id VARCHAR(36) NOT NULL,
  tag_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- 6. 认证会话表
CREATE TABLE auth_sessions (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  ip_address VARCHAR(50),
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. 文章点赞表
CREATE TABLE post_likes (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. 访问统计日志表
CREATE TABLE access_logs (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(36),
  path VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  ip_address VARCHAR(50),
  user_agent TEXT,
  referrer TEXT,
  status_code INTEGER,
  response_time INTEGER,  -- 毫秒
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 添加索引以提高查询性能
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);
CREATE INDEX idx_auth_sessions_token ON auth_sessions(token);
CREATE INDEX idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX idx_access_logs_user_id ON access_logs(user_id);
CREATE INDEX idx_access_logs_path ON access_logs(path);

-- 添加触发器以自动更新updated_at字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为所有需要自动更新updated_at的表添加触发器
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at
BEFORE UPDATE ON tags
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 初始化一些基础数据
-- 注意：在生产环境中不要直接包含这些初始化数据，尤其是管理员密码
-- 这里仅作为示例
-- 1. 创建管理员用户 (密码: admin123, 实际应用中应使用强密码并通过安全方式设置)
INSERT INTO users (username, email, password, role)
VALUES ('admin', 'admin@example.com', '$2b$12$jK5f0q9R0d4tF7v8uI3y9uWxZcVbNmKjHlGfDsaPoQwErTyUiOpAs', 'admin');

-- 2. 创建普通用户 (密码: user123)
INSERT INTO users (username, email, password, role)
VALUES ('user', 'user@example.com', '$2b$12$k7J8L9M0nP1qR2sT3uV4wX5yZ6cVbNmKjHlGfDsaPoQwErTyUiOpAs', 'user');

-- 3. 创建一些标签
INSERT INTO tags (name, slug)
VALUES 
  ('Next.js', 'next-js'),
  ('React', 'react'),
  ('JavaScript', 'javascript'),
  ('TypeScript', 'typescript'),
  ('前端开发', 'frontend-development'),
  ('后端开发', 'backend-development'),
  ('数据库', 'database'),
  ('性能优化', 'performance-optimization');

-- 4. 创建一些示例博客文章
INSERT INTO blog_posts (title, excerpt, content, slug, author_id, status, published_at)
VALUES (
  'Next.js 13 新特性详解',
  '探索 Next.js 13 带来的革命性变化，包括 App Router、Server Components 等新功能，以及如何在实际项目中使用这些特性。',
  '# Next.js 13 新特性详解\n\nNext.js 13 引入了许多激动人心的新功能，彻底改变了我们构建 React 应用的方式。\n\n## App Router\n\nApp Router 是 Next.js 13 中最显著的变化，它提供了一个全新的文件系统路由机制...\n\n## Server Components\n\nServer Components 允许你在服务器上直接渲染 React 组件，减少客户端 JavaScript 的大小...',
  'next-js-13-new-features',
  (SELECT id FROM users WHERE username = 'admin'),
  'published',
  '2024-01-15 10:00:00'
),
(
  'Tailwind CSS 最佳实践',
  '学习 Tailwind CSS 的高级技巧和最佳实践，包括如何组织样式、创建可复用组件，以及性能优化策略。',
  '# Tailwind CSS 最佳实践\n\nTailwind CSS 已经成为现代前端开发中最受欢迎的实用优先 CSS 框架之一。\n\n## 组织样式\n\n在大型项目中，组织你的 Tailwind 样式变得尤为重要...\n\n## 创建可复用组件\n\nTailwind 允许你创建高度可复用的 UI 组件...',
  'tailwind-css-best-practices',
  (SELECT id FROM users WHERE username = 'admin'),
  'published',
  '2024-01-10 14:30:00'
);

-- 5. 为文章添加标签
INSERT INTO post_tags (post_id, tag_id)
VALUES 
  ((SELECT id FROM blog_posts WHERE slug = 'next-js-13-new-features'), (SELECT id FROM tags WHERE slug = 'next-js')),
  ((SELECT id FROM blog_posts WHERE slug = 'next-js-13-new-features'), (SELECT id FROM tags WHERE slug = 'react')),
  ((SELECT id FROM blog_posts WHERE slug = 'next-js-13-new-features'), (SELECT id FROM tags WHERE slug = 'javascript')),
  ((SELECT id FROM blog_posts WHERE slug = 'next-js-13-new-features'), (SELECT id FROM tags WHERE slug = 'typescript')),
  ((SELECT id FROM blog_posts WHERE slug = 'tailwind-css-best-practices'), (SELECT id FROM tags WHERE slug = 'frontend-development')),
  ((SELECT id FROM blog_posts WHERE slug = 'tailwind-css-best-practices'), (SELECT id FROM tags WHERE slug = 'performance-optimization'));