"use client";

import React, { useState, useRef, useEffect } from "react";
import { Popover, PopoverProps } from "@arco-design/web-react";
import clsx from "clsx";
import styles from "./index.module.css";

/**
 * 多行文本省略组件
 * 支持设置最大显示行数，超出部分显示省略号
 * 鼠标悬停时通过 Arco Design 的 Popover 显示完整内容
 */
interface TextEllipsisProps {
  /** 要显示的文本内容 */
  children: string;
  /** 最大显示行数，默认为 2 行 */
  maxLines?: number;
  /** 文本样式类名 */
  className?: string;
  /** 文本样式 */
  style?: React.CSSProperties;
  /** Popover 的触发方式，默认为 hover */
  trigger?: "hover" | "click" | "focus";
  /** Popover 的位置，默认为 top */
  placement?: PopoverProps["position"];
}

const TextEllipsis: React.FC<TextEllipsisProps> = ({
  children,
  maxLines = 2,
  className = "",
  style = {},
  trigger = "hover",
  placement = "top",
}) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  /**
   * 检测文本是否溢出
   * 通过比较元素的 scrollHeight 和 clientHeight 来判断
   */
  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const element = textRef.current;
        const isOverflow = element.scrollHeight > element.clientHeight;
        setIsOverflowing(isOverflow);
      }
    };

    // 初始检测
    checkOverflow();

    // 监听窗口大小变化
    window.addEventListener("resize", checkOverflow);

    // 使用 ResizeObserver 监听元素大小变化
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    return () => {
      window.removeEventListener("resize", checkOverflow);
      resizeObserver.disconnect();
    };
  }, [children, maxLines]);

  /**
   * 生成省略样式
   * 使用 CSS 的 -webkit-line-clamp 实现多行省略
   */
  const ellipsisStyle: React.CSSProperties & { "--max-lines": number; "--cursor": string } = {
    "--max-lines": maxLines,
    "--cursor": isOverflowing ? "pointer" : "default",
    ...style,
  };

  /**
   * 渲染文本内容
   */
  const renderText = () => (
    <div
      ref={textRef}
      className={clsx(styles.textEllipsis, className)}
      style={ellipsisStyle}
    >
      {children}
    </div>
  );

  // 如果文本没有溢出，直接返回文本
  if (!isOverflowing) {
    return renderText();
  }

  // 文本溢出时，使用 Arco Design 的 Popover
  return (
    <Popover
      content={
        <div style={{ maxWidth: "300px", wordBreak: "break-word" }}>
          {children}
        </div>
      }
      trigger={trigger}
      position={placement}
      // 不显示 title，只显示内容
      title={null}
    >
      {renderText()}
    </Popover>
  );
};

export default TextEllipsis;
