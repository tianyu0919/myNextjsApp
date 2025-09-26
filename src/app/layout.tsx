// 兼容包必须在最顶部引入，在其他所有导入之前
import "@ant-design/v5-patch-for-react-19";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import AntdConfig from "./components/AntdConfig";
import "@arco-design/web-react/dist/css/arco.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "我的网站",
  description: "一个使用 Next.js 和 Tailwind CSS 构建的现代化网站",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdConfig>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="min-h-[calc(100vh-65px-293px)]">{children}</main>
            <Footer />
          </div>
        </AntdConfig>
      </body>
    </html>
  );
}
