"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LinkButton from "@/components/LinkButton";
import { Button, App } from "antd";

/**
 * 导航栏组件
 * 包含网站 logo、导航链接和响应式设计
 * 使用 "use client" 指令，可以在客户端使用 hooks
 */
export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { message } = App.useApp(); // 使用 App 上下文获取 message 实例

  /**
   * 切换移动端菜单的展开/收起状态
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  /**
   * 关闭移动端菜单
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    console.log('pathname', pathname);
    // 使用 App 上下文的 message 实例，避免静态方法上下文问题
    message.info(`当前路径: ${pathname}`);
  }, [pathname, message]);

  /**
   * 测试 Ant Design 组件功能
   */
  const testAntdComponents = () => {
    message.success('Ant Design 组件工作正常！');
  };

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo 区域 */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
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

            {/* 桌面端导航链接 */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <LinkButton
                  href="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    pathname === "/"
                      ? "bg-blue-100 text-blue-700 border-b-2 border-blue-700"
                      : "text-gray-900 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                  type={pathname === "/" ? "primary" : "default"}
                >
                  首页
                </LinkButton>
                <LinkButton
                  href="/blog"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    pathname === "/blog"
                      ? "bg-blue-100 text-blue-700 border-b-2 border-blue-700"
                      : "text-gray-900 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                  type={pathname === "/blog" ? "primary" : "default"}
                >
                  博客
                </LinkButton>
                {/* 测试 Ant Design 按钮 */}
                <Button type="primary" onClick={testAntdComponents}>
                  测试 Antd
                </Button>
              </div>
            </div>

            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <button 
                className="text-gray-900 hover:text-blue-600 p-2 rounded-md transition-colors duration-200"
                onClick={toggleMobileMenu}
                aria-label="切换菜单"
              >
                {isMobileMenuOpen ? (
                  // 关闭图标 (X)
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  // 菜单图标 (三条线)
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 移动端菜单遮罩层 */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* 移动端侧边菜单 */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 菜单头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">菜单</h2>
          <button 
            onClick={closeMobileMenu}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-md transition-colors duration-200"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 菜单内容 */}
        <div className="p-6">
          <nav className="space-y-4">
            <LinkButton
              href="/"
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                pathname === "/"
                  ? "bg-blue-100 text-blue-700 border-l-4 border-blue-700"
                  : "text-gray-900 hover:text-blue-600 hover:bg-gray-50"
              }`}
              onClick={closeMobileMenu}
            >
              首页
            </LinkButton>
            <LinkButton
              href="/blog"
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                pathname === "/blog"
                  ? "bg-blue-100 text-blue-700 border-l-4 border-blue-700"
                  : "text-gray-900 hover:text-blue-600 hover:bg-gray-50"
              }`}
              onClick={closeMobileMenu}
            >
              博客
            </LinkButton>
          </nav>
        </div>
      </div>
    </>
  );
}
