import Link from "next/link";

/**
 * 英雄区域组件
 * 展示网站的主要信息和行动号召
 */
function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          欢迎来到我的网站
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          这是一个使用 Next.js 和 Tailwind CSS 构建的现代化网站。
          探索我们的内容，发现更多精彩。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/blog"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            浏览博客
          </Link>
          <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200">
            了解更多
          </button>
        </div>
      </div>
    </section>
  );
}

/**
 * 特色内容区域组件
 * 展示网站的主要功能和内容
 */
function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            网站特色
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            我们提供多种功能和服务，满足您的各种需求
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* 特色卡片 1 */}
          <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">快速性能</h3>
            <p className="text-gray-600">基于 Next.js 构建，提供卓越的性能和用户体验</p>
          </div>

          {/* 特色卡片 2 */}
          <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">响应式设计</h3>
            <p className="text-gray-600">使用 Tailwind CSS 构建，完美适配各种设备</p>
          </div>

          {/* 特色卡片 3 */}
          <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">丰富内容</h3>
            <p className="text-gray-600">博客系统提供丰富的内容和知识分享</p>
          </div>
        </div>
      </div>
    </section>
  );
}



/**
 * 首页主组件
 * 现在只包含页面特有的内容，导航栏和页脚已在全局布局中
 */
export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
    </>
  );
}
