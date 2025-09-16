"use client";

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const { Title, Text } = Typography;

/**
 * 登录页面组件
 * 提供用户登录表单和认证功能
 */
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  /**
   * 处理登录表单提交
   */
  const handleLogin = async (values: { username: string; password: string }) => {
    try {
      setLoading(true);
      
      // 发送登录请求到API
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const result = await response.json();
      
      if (result.success) {
        message.success('登录成功！');
        
        // 检查是否有重定向参数
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect');
        
        // 如果有重定向参数，重定向到指定页面，否则重定向到首页
        if (redirectUrl && isSafeRedirect(redirectUrl)) {
          router.replace(redirectUrl);
        } else {
          router.replace('/');
        }
      } else {
        message.error(result.message || '登录失败，请重试');
      }
    } catch (error) {
      console.error('登录请求失败:', error);
      message.error('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * 验证重定向URL是否安全
   * 防止开放重定向攻击
   */
  const isSafeRedirect = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url, window.location.origin);
      // 确保重定向URL与当前站点同域
      return parsedUrl.origin === window.location.origin;
    } catch (error) {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto">
            <Image 
              src="/next.svg" 
              alt="Logo" 
              width={64} 
              height={64} 
              className="object-contain"
            />
          </div>
          <Title level={2} className="mt-4 text-gray-900">
            欢迎回来
          </Title>
          <Text className="text-gray-600">
            请登录您的账户以继续使用
          </Text>
        </div>
        
        <Card className="shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <Form
              form={form}
              onFinish={handleLogin}
              layout="vertical"
            >
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { whitespace: true, message: '用户名不能为空' }
                ]}
              >
                <Input
                  placeholder="请输入用户名"
                  className="rounded-md"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { whitespace: true, message: '密码不能为空' }
                ]}
              >
                <Input.Password
                  placeholder="请输入密码"
                  className="rounded-md"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full h-10 text-base rounded-md"
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
            
            <div className="mt-4 space-y-2">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text type="secondary">测试账号：</Text>
                <Text>用户名: admin, 密码: admin123 (管理员)</Text>
                <Text>用户名: user, 密码: user123 (普通用户)</Text>
              </Space>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}