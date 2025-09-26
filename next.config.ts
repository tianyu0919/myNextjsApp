import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 确保 Ant Design 组件被正确转译
  transpilePackages: ['antd', '@ant-design/icons'],
  
  // 配置 WebAssembly 支持
  webpack: (config, { isServer }) => {
    // 确保 WASM 文件被正确处理
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // 在服务器端禁用 WASM
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },
  
  // Turbopack 配置（现在已稳定）
  turbopack: {
    // 保持默认配置，确保 Ant Design 组件正常工作
  },
};

export default nextConfig;
