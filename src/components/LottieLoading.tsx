"use client";

import React from "react";
import { useLottie } from "lottie-react";
import groovyWalkAnimation from "../../public/animations/groovyWalkAnimation.json";

/**
 * 客户端 Lottie Loading 组件
 */
export default function LottieLoading() {
  const options = {
    animationData: groovyWalkAnimation,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options, {
    width: 100,
    height: 100,
  });

  return <div>{View}</div>;
}
