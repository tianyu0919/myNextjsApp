"use client";

import React from 'react';
import TextEllipsis from '@/components/shared/TextEllipsis';

/**
 * 多行文本省略组件演示页面
 * 展示不同配置下的组件效果
 */
export default function TextEllipsisDemo() {
  const longText = "这是一段很长的文本内容，用来演示多行文本省略组件的功能。当文本内容超过指定的行数时，会自动显示省略号，并且鼠标悬停时会通过 Popover 显示完整的内容。这个组件支持自定义最大显示行数、触发方式、位置等配置。";
  
  const veryLongText = "这是一段非常长的文本内容，包含了更多的信息。在实际应用中，这种组件常用于显示文章摘要、产品描述、用户评论等内容。当内容过长时，通过省略显示可以保持界面的整洁性，同时用户可以通过悬停查看完整内容。组件使用了 Arco Design 的 Popover 组件来实现悬停显示功能，并且不显示标题，只显示内容。";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          多行文本省略组件演示
        </h1>
        
        <div className="space-y-8">
          {/* 基础用法 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              基础用法 - 默认 2 行
            </h2>
            <div className="border p-4 rounded">
              <TextEllipsis>
                {longText}
              </TextEllipsis>
            </div>
          </div>

          {/* 自定义行数 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              自定义行数 - 3 行
            </h2>
            <div className="border p-4 rounded">
              <TextEllipsis maxLines={3}>
                {veryLongText}
              </TextEllipsis>
            </div>
          </div>

          {/* 单行省略 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              单行省略 - 1 行
            </h2>
            <div className="border p-4 rounded">
              <TextEllipsis maxLines={1}>
                {longText}
              </TextEllipsis>
            </div>
          </div>

          {/* 点击触发 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              点击触发 Popover
            </h2>
            <div className="border p-4 rounded">
              <TextEllipsis 
                maxLines={2} 
                trigger="click"
                placement="bottom"
              >
                {veryLongText}
              </TextEllipsis>
            </div>
          </div>

          {/* 自定义样式 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              自定义样式
            </h2>
            <div className="border p-4 rounded">
              <TextEllipsis 
                maxLines={2}
                className="text-blue-600 font-medium"
                style={{ fontSize: '16px', lineHeight: '1.6' }}
              >
                {longText}
              </TextEllipsis>
            </div>
          </div>

          {/* 不同位置的 Popover */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              不同位置的 Popover
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border p-4 rounded">
                <h3 className="text-sm font-medium mb-2">右侧显示</h3>
                <TextEllipsis 
                  maxLines={2}
                  placement="right"
                >
                  {longText}
                </TextEllipsis>
              </div>
              <div className="border p-4 rounded">
                <h3 className="text-sm font-medium mb-2">底部显示</h3>
                <TextEllipsis 
                  maxLines={2}
                  placement="bottom"
                >
                  {longText}
                </TextEllipsis>
              </div>
            </div>
          </div>

          {/* 使用说明 */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
              使用说明
            </h2>
            <div className="text-blue-700 space-y-2">
              <p>• 鼠标悬停在省略的文本上可查看完整内容</p>
              <p>• 支持自定义最大显示行数</p>
              <p>• 支持不同的触发方式（hover、click、focus）</p>
              <p>• 支持自定义 Popover 显示位置</p>
              <p>• 自动检测文本是否溢出，未溢出时不显示 Popover</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
