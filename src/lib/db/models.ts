// 数据库模型TypeScript接口定义

/**
 * 用户模型接口
 */
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;  // 注意：在前端显示时应隐藏此字段
  role: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

/**
 * 博客文章模型接口
 */
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  authorId: string;
  coverImageUrl?: string;
  readTime?: number;
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  // 关联数据
  author?: User;
  tags?: Tag[];
  comments?: Comment[];
  likesCount?: number;
}

/**
 * 评论模型接口
 */
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  isApproved: boolean;
  // 关联数据
  user?: User;
  post?: BlogPost;
  replies?: Comment[];
}

/**
 * 标签模型接口
 */
export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  // 关联数据
  posts?: BlogPost[];
}

/**
 * 认证会话模型接口
 */
export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
  createdAt: Date;
  // 关联数据
  user?: User;
}

/**
 * 文章点赞模型接口
 */
export interface PostLike {
  id: string;
  postId: string;
  userId: string;
  createdAt: Date;
  // 关联数据
  user?: User;
  post?: BlogPost;
}

/**
 * 访问日志模型接口
 */
export interface AccessLog {
  id: string;
  userId?: string;
  path: string;
  method: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  statusCode?: number;
  responseTime?: number;
  createdAt: Date;
  // 关联数据
  user?: User;
}

/**
 * 分页查询结果接口
 */
export interface PaginationResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * 文章查询过滤参数
 */
export interface PostFilterParams {
  page?: number;
  pageSize?: number;
  status?: 'draft' | 'published' | 'archived';
  authorId?: string;
  tagId?: string;
  searchTerm?: string;
  sortBy?: 'createdAt' | 'publishedAt' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 评论查询过滤参数
 */
export interface CommentFilterParams {
  page?: number;
  pageSize?: number;
  postId?: string;
  userId?: string;
  parentId?: string;
  isApproved?: boolean;
}

/**
 * 用户创建参数
 */
export interface CreateUserParams {
  username: string;
  email: string;
  password: string;
  role?: string;
  avatarUrl?: string;
  bio?: string;
}

/**
 * 文章创建参数
 */
export interface CreatePostParams {
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  authorId: string;
  coverImageUrl?: string;
  readTime?: number;
  status?: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  tagIds?: string[];
}

/**
 * 评论创建参数
 */
export interface CreateCommentParams {
  postId: string;
  userId: string;
  content: string;
  parentId?: string;
}

/**
 * 标签创建参数
 */
export interface CreateTagParams {
  name: string;
  slug: string;
}