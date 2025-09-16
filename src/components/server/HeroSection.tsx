/**
 * 英雄区域组件 - 服务端组件
 * 展示网站的主要信息和行动号召
 */

import Link from "next/link";

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

export default HeroSection;