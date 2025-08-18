import Link from "next/link";

/**
 * 博客文章卡片组件
 * 展示单篇博客文章的预览信息
 */
function BlogCard({ title, excerpt, date, readTime }: {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}) {
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="mb-4">
        <span className="text-sm text-gray-500">{date}</span>
        <span className="mx-2 text-gray-400">•</span>
        <span className="text-sm text-gray-500">{readTime}</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-3">
        {excerpt}
      </p>
      <Link
        href="#"
        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        阅读更多 →
      </Link>
    </article>
  );
}

/**
 * 博客页面主组件
 * 展示博客文章列表和页面标题
 */
export default function BlogPage() {
  // 模拟博客文章数据
  const blogPosts = [
    {
      title: "Next.js 13 新特性详解",
      excerpt: "探索 Next.js 13 带来的革命性变化，包括 App Router、Server Components 等新功能，以及如何在实际项目中使用这些特性。",
      date: "2024-01-15",
      readTime: "8 分钟"
    },
    {
      title: "Tailwind CSS 最佳实践",
      excerpt: "学习 Tailwind CSS 的高级技巧和最佳实践，包括如何组织样式、创建可复用组件，以及性能优化策略。",
      date: "2024-01-10",
      readTime: "6 分钟"
    },
    {
      title: "现代前端开发工具链",
      excerpt: "深入了解现代前端开发中不可或缺的工具，从构建工具到代码质量检查，全面提升开发效率。",
      date: "2024-01-05",
      readTime: "10 分钟"
    },
    {
      title: "响应式设计原则",
      excerpt: "掌握响应式设计的核心原则和实现技巧，确保你的网站在各种设备上都能提供优秀的用户体验。",
      date: "2024-01-01",
      readTime: "7 分钟"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题区域 */}
      <section className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            博客
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            分享技术见解、开发经验和行业动态
          </p>
        </div>
      </section>

      {/* 博客文章列表 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <BlogCard
                key={index}
                title={post.title}
                excerpt={post.excerpt}
                date={post.date}
                readTime={post.readTime}
              />
            ))}
          </div>
          
          {/* 加载更多按钮 */}
          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
              加载更多文章
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
