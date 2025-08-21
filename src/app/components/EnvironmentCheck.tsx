"use client";

import React, { useEffect, useState } from "react";
import { Card, Typography, Space, Tag, Alert, App } from "antd";

const { Title, Text } = Typography;

/**
 * 环境信息接口
 */
interface EnvironmentInfo {
  reactVersion: string;
  reactDomVersion: string;
  userAgent: string;
  timestamp: string;
  antdPatchLoaded: boolean;
}

/**
 * 环境检查组件
 * 用于诊断 React 19 和 Ant Design 的兼容性问题
 * 使用 App 上下文确保兼容性
 */
export default function EnvironmentCheck() {
  const { message } = App.useApp(); // 使用 App 上下文
  const [envInfo, setEnvInfo] = useState<EnvironmentInfo>({
    reactVersion: '',
    reactDomVersion: '',
    userAgent: '',
    timestamp: '',
    antdPatchLoaded: false,
  });

  useEffect(() => {
    // 收集环境信息
    const info: EnvironmentInfo = {
      reactVersion: React.version,
      reactDomVersion: 'Unknown', // React 19 中 DOM 版本信息可能不可用
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      // 检查 Ant Design 兼容包是否加载
      antdPatchLoaded: typeof window !== 'undefined' && 
        (window as unknown as Record<string, unknown>).__ANTD_PATCH_LOADED__ === true,
    };
    
    setEnvInfo(info);
    
    // 在控制台输出详细信息
    console.log('环境检查信息:', info);
    
    // 显示兼容性状态消息
    if (info.antdPatchLoaded) {
      message.success('Ant Design React 19 兼容包已加载');
    } else {
      message.warning('Ant Design React 19 兼容包未检测到');
    }
  }, [message]);

  return (
    <Card title="环境检查" style={{ margin: '20px', maxWidth: '800px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert
          message="React 19 兼容性检查"
          description="检查 Ant Design 在 React 19 环境下的兼容性状态"
          type="info"
          showIcon
        />
        
        <div>
          <Title level={5}>React 版本信息</Title>
          <Space wrap>
            <Tag color="blue">React: {envInfo.reactVersion}</Tag>
            <Tag color="green">React DOM: {envInfo.reactDomVersion}</Tag>
          </Space>
        </div>

        <div>
          <Title level={5}>兼容性状态</Title>
          <Space wrap>
            <Tag color={envInfo.antdPatchLoaded ? "success" : "error"}>
              兼容包: {envInfo.antdPatchLoaded ? "已加载" : "未加载"}
            </Tag>
          </Space>
        </div>

        <div>
          <Title level={5}>浏览器信息</Title>
          <Text code>{envInfo.userAgent}</Text>
        </div>

        <div>
          <Title level={5}>检查时间</Title>
          <Text>{envInfo.timestamp}</Text>
        </div>
      </Space>
    </Card>
  );
}
