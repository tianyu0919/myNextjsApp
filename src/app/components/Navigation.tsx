"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * 导航栏组件
 * 包含网站 logo、导航链接和响应式设计
 * 使用 "use client" 指令，可以在客户端使用 hooks
 */
export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo 区域 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/next.svg"
                alt="Logo"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-gray-900">我的网站</span>
            </Link>
          </div>

          {/* 导航链接 */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  pathname === "/"
                    ? "bg-blue-100 text-blue-700 border-b-2 border-blue-700"
                    : "text-gray-900 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                首页
              </Link>
              <Link
                href="/blog"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  pathname === "/blog"
                    ? "bg-blue-100 text-blue-700 border-b-2 border-blue-700"
                    : "text-gray-900 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                博客
              </Link>
            </div>
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <button className="text-gray-900 hover:text-blue-600 p-2 rounded-md">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
