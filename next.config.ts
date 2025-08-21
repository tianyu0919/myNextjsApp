import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 确保 Ant Design 组件被正确转译
  transpilePackages: ['antd', '@ant-design/icons'],
  
  // Turbopack 配置（现在已稳定）
  turbopack: {
    // 保持默认配置，确保 Ant Design 组件正常工作
  },
};

export default nextConfig;
