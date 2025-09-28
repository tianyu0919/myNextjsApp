"use client";

import React from "react";

interface LoadingProps {
  size?: number;
  className?: string;
  variant?: "cube" | "spinner" | "pulse" | "wave" | "orbit";
  color?: string;
}

/**
 * Loading 组件 - 3D变换效果的加载指示器
 * @param size 动画尺寸，默认 150px
 * @param className 自定义样式类名
 * @param variant 动画类型：cube(立方体)、spinner(旋转器)、pulse(脉冲)、wave(波浪)、orbit(轨道)
 * @param color 主题颜色，默认 #3b82f6
 */
const Loading: React.FC<LoadingProps> = ({
  size = 150,
  className = "",
  variant = "cube",
  color = "#3b82f6",
}) => {
  const containerStyle = {
    width: size,
    height: size,
  };

  // 立方体旋转动画
  const CubeLoader = () => (
    <div className="relative" style={containerStyle}>
      <style jsx>{`
        @keyframes cube-rotate {
          0% {
            transform: rotateX(0deg) rotateY(0deg);
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg);
          }
        }
        .cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: cube-rotate 2s infinite linear;
        }
        .cube-face {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid ${color};
          background: ${color}20;
          backdrop-filter: blur(10px);
        }
        .cube-face:nth-child(1) {
          transform: rotateY(0deg) translateZ(${size / 2}px);
        }
        .cube-face:nth-child(2) {
          transform: rotateY(90deg) translateZ(${size / 2}px);
        }
        .cube-face:nth-child(3) {
          transform: rotateY(180deg) translateZ(${size / 2}px);
        }
        .cube-face:nth-child(4) {
          transform: rotateY(-90deg) translateZ(${size / 2}px);
        }
        .cube-face:nth-child(5) {
          transform: rotateX(90deg) translateZ(${size / 2}px);
        }
        .cube-face:nth-child(6) {
          transform: rotateX(-90deg) translateZ(${size / 2}px);
        }
      `}</style>
      <div className="cube">
        <div className="cube-face"></div>
        <div className="cube-face"></div>
        <div className="cube-face"></div>
        <div className="cube-face"></div>
        <div className="cube-face"></div>
        <div className="cube-face"></div>
      </div>
    </div>
  );

  // 3D 旋转器动画
  const SpinnerLoader = () => (
    <div className="relative" style={containerStyle}>
      <style jsx>{`
        @keyframes spinner-rotate {
          0% {
            transform: rotate(0deg) translateX(${size / 3}px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(${size / 3}px) rotate(-360deg);
          }
        }
        @keyframes spinner-scale {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.5);
          }
        }
        .spinner-orb {
          width: ${size / 8}px;
          height: ${size / 8}px;
          background: ${color};
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: 0 ${size / 6}px;
          animation: spinner-rotate 1.5s infinite linear,
            spinner-scale 1.5s infinite ease-in-out;
          box-shadow: 0 0 20px ${color};
        }
        .spinner-orb:nth-child(1) {
          animation-delay: 0s;
        }
        .spinner-orb:nth-child(2) {
          animation-delay: 0.2s;
        }
        .spinner-orb:nth-child(3) {
          animation-delay: 0.4s;
        }
        .spinner-orb:nth-child(4) {
          animation-delay: 0.6s;
        }
        .spinner-orb:nth-child(5) {
          animation-delay: 0.8s;
        }
        .spinner-orb:nth-child(6) {
          animation-delay: 1s;
        }
      `}</style>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="spinner-orb"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );

  // 3D 脉冲动画
  const PulseLoader = () => (
    <div
      className="relative flex items-center justify-center"
      style={{
        ...containerStyle,
        perspective: '200px',
        transformStyle: 'preserve-3d'
      }}
    >
      <style jsx>{`
        @keyframes pulse-3d {
          0% {
            transform: scale(1) rotateX(0deg) rotateY(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.5) rotateX(180deg) rotateY(180deg);
            opacity: 0.7;
          }
          100% {
            transform: scale(1) rotateX(360deg) rotateY(360deg);
            opacity: 1;
          }
        }
        .pulse-ring {
          position: absolute;
          border: 3px solid ${color};
          border-radius: 50%;
          animation: pulse-3d 2s infinite ease-in-out;
        }
        .pulse-ring:nth-child(1) {
          width: ${size}px;
          height: ${size}px;
          animation-delay: 0s;
        }
        .pulse-ring:nth-child(2) {
          width: ${size * 0.8}px;
          height: ${size * 0.8}px;
          animation-delay: 0.3s;
        }
        .pulse-ring:nth-child(3) {
          width: ${size * 0.6}px;
          height: ${size * 0.6}px;
          animation-delay: 0.6s;
        }
      `}</style>
      <div className="pulse-ring"></div>
      <div className="pulse-ring"></div>
      <div className="pulse-ring"></div>
    </div>
  );

  // 波浪动画
  const WaveLoader = () => (
    <div
      className="relative flex items-center justify-center"
      style={{
        ...containerStyle,
        perspective: '200px',
        transformStyle: 'preserve-3d'
      }}
    >
      <style jsx>{`
        @keyframes wave-3d {
          0%,
          100% {
            transform: translateY(0) rotateX(0deg);
          }
          25% {
            transform: translateY(-${size / 4}px) rotateX(90deg);
          }
          50% {
            transform: translateY(0) rotateX(180deg);
          }
          75% {
            transform: translateY(${size / 4}px) rotateX(270deg);
          }
        }
        .wave-bar {
          width: ${size / 12}px;
          height: ${size / 3}px;
          background: linear-gradient(45deg, ${color}, ${color}80);
          margin: 0 2px;
          border-radius: ${size / 24}px;
          animation: wave-3d 1.5s infinite ease-in-out;
          transform-style: preserve-3d;
        }
        .wave-bar:nth-child(1) {
          animation-delay: 0s;
        }
        .wave-bar:nth-child(2) {
          animation-delay: 0.1s;
        }
        .wave-bar:nth-child(3) {
          animation-delay: 0.2s;
        }
        .wave-bar:nth-child(4) {
          animation-delay: 0.3s;
        }
        .wave-bar:nth-child(5) {
          animation-delay: 0.4s;
        }
      `}</style>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="wave-bar"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  // 轨道动画
  const OrbitLoader = () => (
    <div className="relative" style={containerStyle}>
      <style jsx>{`
        @keyframes orbit-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes orbit-reverse {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }
        .orbit-container {
          width: 100%;
          height: 100%;
          position: relative;
          animation: orbit-rotate 3s infinite linear;
        }
        .orbit-dot {
          width: ${size / 8}px;
          height: ${size / 8}px;
          background: ${color};
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: 0 ${size / 3}px;
          box-shadow: 0 0 15px ${color};
        }
        .orbit-dot:nth-child(1) {
          animation: orbit-reverse 2s infinite linear;
          transform: rotate(0deg) translateX(${size / 3}px);
        }
        .orbit-dot:nth-child(2) {
          animation: orbit-reverse 2s infinite linear;
          animation-delay: 0.5s;
          transform: rotate(90deg) translateX(${size / 3}px);
        }
        .orbit-dot:nth-child(3) {
          animation: orbit-reverse 2s infinite linear;
          animation-delay: 1s;
          transform: rotate(180deg) translateX(${size / 3}px);
        }
        .orbit-dot:nth-child(4) {
          animation: orbit-reverse 2s infinite linear;
          animation-delay: 1.5s;
          transform: rotate(270deg) translateX(${size / 3}px);
        }
      `}</style>
      <div className="orbit-container">
        <div className="orbit-dot"></div>
        <div className="orbit-dot"></div>
        <div className="orbit-dot"></div>
        <div className="orbit-dot"></div>
      </div>
    </div>
  );

  // 根据 variant 渲染不同的动画
  const renderLoader = () => {
    switch (variant) {
      case "cube":
        return <CubeLoader />;
      case "spinner":
        return <SpinnerLoader />;
      case "pulse":
        return <PulseLoader />;
      case "wave":
        return <WaveLoader />;
      case "orbit":
        return <OrbitLoader />;
      default:
        return <CubeLoader />;
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {renderLoader()}
    </div>
  );
};

export default Loading;
