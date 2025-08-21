"use client";

import { ConfigProvider, theme, App } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ReactNode } from "react";

/**
 * Ant Design 配置组件
 * 专门处理 Ant Design 的配置和 React 19 兼容性
 * 使用 App 组件确保静态方法能正确访问上下文
 */
interface AntdConfigProps {
  children: ReactNode;
}

export default function AntdConfig({ children }: AntdConfigProps) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            // 自定义主题 token
            colorPrimary: '#1890ff',
            borderRadius: 6,
          },
        }}
        // 确保组件在 React 19 中正常工作
        componentSize="middle"
        space={{ size: 'middle' }}
      >
        <App>
          {children}
        </App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
