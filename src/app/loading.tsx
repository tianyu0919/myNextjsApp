import React from "react";
import LottieLoading from "../components/LottieLoading";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* Lottie 动画 */}
        <LottieLoading />
        <p className="text-gray-600 text-lg">加载中...</p>
      </div>
    </div>
  );
}
