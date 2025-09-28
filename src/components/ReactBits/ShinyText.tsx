import React from "react";
import clsx from "clsx";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string; // 支持传入颜色，如 "#ff0000", "red", "rgb(255,0,0)" 等
  opacity?: number; // 控制高光透明度，默认 0.8
}


/**
 * 使用正则表达式解析常见颜色名称
 * @param color 颜色名称
 * @returns RGB 值数组 [r, g, b] 或 null
 */
const parseColorName = (color: string): [number, number, number] | null => {
  const lowerColor = color.toLowerCase();
  
  // 使用正则表达式匹配常见颜色模式
  const colorPatterns = [
    // 基础颜色
    { pattern: /^(black|k)$/i, rgb: [0, 0, 0] },
    { pattern: /^(white|w)$/i, rgb: [255, 255, 255] },
    { pattern: /^(red|r)$/i, rgb: [255, 0, 0] },
    { pattern: /^(green|g)$/i, rgb: [0, 128, 0] },
    { pattern: /^(blue|b)$/i, rgb: [0, 0, 255] },
    { pattern: /^(yellow|y)$/i, rgb: [255, 255, 0] },
    { pattern: /^(cyan|c)$/i, rgb: [0, 255, 255] },
    { pattern: /^(magenta|m)$/i, rgb: [255, 0, 255] },
    
    // 扩展颜色
    { pattern: /^orange$/i, rgb: [255, 165, 0] },
    { pattern: /^purple$/i, rgb: [128, 0, 128] },
    { pattern: /^pink$/i, rgb: [255, 192, 203] },
    { pattern: /^brown$/i, rgb: [165, 42, 42] },
    { pattern: /^gray|grey$/i, rgb: [128, 128, 128] },
    { pattern: /^lime$/i, rgb: [0, 255, 0] },
    { pattern: /^maroon$/i, rgb: [128, 0, 0] },
    { pattern: /^navy$/i, rgb: [0, 0, 128] },
    { pattern: /^olive$/i, rgb: [128, 128, 0] },
    { pattern: /^teal$/i, rgb: [0, 128, 128] },
    { pattern: /^silver$/i, rgb: [192, 192, 192] },
    { pattern: /^aqua$/i, rgb: [0, 255, 255] },
    { pattern: /^fuchsia$/i, rgb: [255, 0, 255] },
    
    // 深浅色变体
    { pattern: /^light\s*(gray|grey)$/i, rgb: [211, 211, 211] },
    { pattern: /^dark\s*(gray|grey)$/i, rgb: [64, 64, 64] },
    { pattern: /^light\s*blue$/i, rgb: [173, 216, 230] },
    { pattern: /^dark\s*blue$/i, rgb: [0, 0, 139] },
    { pattern: /^light\s*green$/i, rgb: [144, 238, 144] },
    { pattern: /^dark\s*green$/i, rgb: [0, 100, 0] },
    { pattern: /^light\s*red$/i, rgb: [255, 182, 193] },
    { pattern: /^dark\s*red$/i, rgb: [139, 0, 0] },
  ];
  
  for (const { pattern, rgb } of colorPatterns) {
    if (pattern.test(lowerColor)) {
      return rgb as [number, number, number];
    }
  }
  
  return null;
};

/**
 * 将颜色转换为 RGBA 格式（服务端兼容）
 * @param color 颜色值，支持 hex、rgb、rgba、颜色名称等
 * @param opacity 透明度，0-1 之间
 * @returns RGBA 格式的颜色字符串
 */
const colorToRgba = (color: string, opacity: number = 1): string => {
  if (!color) {
    return `rgba(0, 0, 0, ${opacity})`;
  }

  // 处理 rgba 格式
  if (color.startsWith('rgba(')) {
    const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (rgbaMatch) {
      const [, r, g, b] = rgbaMatch;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  }

  // 处理 rgb 格式
  if (color.startsWith('rgb(')) {
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  }

  // 处理 hex 格式
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    
    // 3位 hex (#fff)
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    // 6位 hex (#ffffff)
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    // 8位 hex (#ffffffff) - 包含 alpha
    if (hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const a = parseInt(hex.slice(6, 8), 16) / 255;
      return `rgba(${r}, ${g}, ${b}, ${a * opacity})`;
    }
  }

  // 处理颜色名称 - 使用正则表达式解析
  const rgb = parseColorName(color);
  
  if (rgb) {
    const [r, g, b] = rgb;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // 如果解析失败，返回默认的黑色
  return `rgba(0, 0, 0, ${opacity})`;
};

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
  color = "#000000", // 默认白色
  opacity = 0.8, // 默认透明度
}) => {
  const animationDuration = `${speed}s`;
  
  // 将传入的颜色转换为 RGBA 格式
  const rgbaColor = colorToRgba(color, opacity);

  return (
    <div
      className={clsx(
        "bg-clip-text inline-block",
        !disabled && "animate-shine",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, ${rgbaColor} 50%, rgba(255, 255, 255, 0) 60%)`,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        animationDuration: animationDuration,
      }}
    >
      {text}
    </div>
  );
};

export default ShinyText;
