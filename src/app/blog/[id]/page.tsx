import React from "react";
import Loading from "@/components/Loading";

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log(id);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          博客详情页面
        </h1>
        <p className="text-lg text-gray-600">
          页面 ID: {id}
        </p>
      </div>
      
      <Loading size={200} className="mb-8" />
      
      <div className="text-center">
        <p className="text-gray-500">
          正在加载页面内容...
        </p>
      </div>
    </div>
  );
}
