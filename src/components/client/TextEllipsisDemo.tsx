"use client";

import React, { useEffect, useState } from "react";
import TextEllipsis from "@/components/shared/TextEllipsis";
import { Button, Space } from "antd";
import init, { add, greet, fibonacci } from "../../../rust-pkg/rust_wasm_browser";

/**
 * TextEllipsis 组件演示 - 客户端组件
 * 在首页展示多行文本省略组件的使用效果
 */
function TextEllipsisDemo() {
  const [wasmLoaded, setWasmLoaded] = useState(false);
  const [result, setResult] = useState<string | number>(0);
  // 初始化 WASM 模块
  useEffect(() => {
    const loadWasm = async () => {
      try {
        await init();
        setWasmLoaded(true);
        console.log("WASM 模块加载成功");
      } catch (error) {
        console.error("WASM 模块加载失败:", error);
      }
    };

    loadWasm();
  }, []);
  const longText =
    "这是一个多行文本省略组件的演示。当文本内容超过指定的行数时，会自动显示省略号，鼠标悬停时会通过 Popover 显示完整的内容。这个组件支持自定义最大显示行数、触发方式、位置等配置，非常适合用于显示文章摘要、产品描述等内容。";

  const veryLongText =
    "这是一段非常长的文本内容，用来演示多行文本省略组件的功能。在实际应用中，这种组件常用于显示文章摘要、产品描述、用户评论等内容。当内容过长时，通过省略显示可以保持界面的整洁性，同时用户可以通过悬停查看完整内容。组件使用了 Ant Design 的 Popover 组件来实现悬停显示功能，并且不显示标题，只显示内容。";

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            多行文本省略组件
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            智能的文本省略显示，悬停查看完整内容
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 基础用法 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              基础用法 - 2 行省略
            </h3>
            <div className="border p-4 rounded bg-gray-50">
              <TextEllipsis>{longText}</TextEllipsis>
            </div>
          </div>

          {/* 自定义行数 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              自定义行数 - 3 行省略
            </h3>
            <div className="border p-4 rounded bg-gray-50">
              <TextEllipsis maxLines={3}>{veryLongText}</TextEllipsis>
            </div>
          </div>

          {/* 点击触发 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              点击触发 - 底部显示
            </h3>
            <div className="border p-4 rounded bg-gray-50">
              <TextEllipsis maxLines={2} trigger="click" placement="bottom">
                {longText}
              </TextEllipsis>
            </div>
          </div>

          {/* 自定义样式 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              自定义样式
            </h3>
            <div className="border p-4 rounded bg-gray-50">
              <TextEllipsis
                maxLines={2}
                className="text-blue-600 font-medium"
                style={{ fontSize: "16px", lineHeight: "1.6" }}
              >
                {longText}
              </TextEllipsis>
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">使用说明</h3>
          <div className="text-blue-700 space-y-2">
            <p>• 鼠标悬停在省略的文本上可查看完整内容</p>
            <p>• 支持自定义最大显示行数（默认 2 行）</p>
            <p>• 支持不同的触发方式（hover、click、focus）</p>
            <p>• 支持自定义 Popover 显示位置</p>
            <p>• 自动检测文本是否溢出，未溢出时不显示 Popover</p>
          </div>
        </div>

        {/* WASM 功能测试区域 */}
        <div className="mt-8 bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-green-800">
            Rust WASM 功能测试
          </h3>
          <div className="space-x-4">
            <Space.Compact>
              <Button
                disabled={!wasmLoaded}
                onClick={() => {
                  if (wasmLoaded) {
                    const result = add(BigInt(1), BigInt(2));
                    setResult(Number(result));
                  }
                }}
              >
                {wasmLoaded ? "测试加法 (1+2)" : "WASM 加载中..."}
              </Button>
              <Button
                disabled={!wasmLoaded}
                onClick={() => {
                  if (wasmLoaded) {
                    const str = greet("Hello from Rust WASM!");
                    setResult(str);
                  }
                }}
              >
                {wasmLoaded ? "测试问候" : "WASM 加载中..."}
              </Button>
              <Button
                disabled={!wasmLoaded}
                onClick={() => {
                  if (wasmLoaded) {
                    const a = fibonacci(10);
                    console.log(a);
                    setResult(Number(a));
                  }
                }}
              >
                {wasmLoaded ? "测试斐波那契数列" : "WASM 加载中..."}
              </Button>
            </Space.Compact>
          </div>
          <div className="mt-4 p-10 bg-white rounded-lg block">
            <div>结果：{result}</div>
          </div>
          <p className="text-sm text-green-600 mt-2">
            {wasmLoaded ? "✅ WASM 模块已加载" : "⏳ WASM 模块加载中..."}
          </p>
        </div>
      </div>
    </section>
  );
}

export default TextEllipsisDemo;
