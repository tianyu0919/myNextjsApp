/**
 * 首页主组件 - 服务端组件
 * 组装各种UI组件，遵循Next.js的组件拆分最佳实践
 */
// 导入服务端组件
import HeroSection from "@/components/server/HeroSection";
import FeaturesSection from "@/components/server/FeaturesSection";
import DatabaseStatus from "@/components/server/DatabaseStatus";
import DataFetcher from "@/components/server/DataFetcher";

// 导入客户端组件
import EnvironmentCheck from "@/components/client/EnvironmentCheck";
import TextEllipsisDemo from "@/components/client/TextEllipsisDemo";
import Shuffle from "@/components/ReactBits/Shuffle";
import ShinyText from "@/components/ReactBits/ShinyText";
import Loading from "@/components/Loading";

export default function Home() {
  // 首页组件现在非常简洁，只负责组装不同类型的组件
  return (
    <>
      {/* 服务端组件 - 直接在服务器端渲染 */}
      <HeroSection />
      <FeaturesSection />
      <Shuffle text="Loading..." />
      <div className="space-y-4">
        <ShinyText
          text="默认黑色闪光文字"
          disabled={false}
          speed={5}
          className="text-4xl"
        />
        <ShinyText
          text="红色闪光文字"
          color="#ff0000"
          opacity={0.9}
          speed={3}
          className="text-4xl"
        />
        <ShinyText
          text="蓝色闪光文字"
          color="blue"
          opacity={0.7}
          speed={4}
          className="text-4xl"
        />
        <ShinyText
          text="绿色闪光文字"
          color="rgb(0, 255, 0)"
          opacity={0.8}
          speed={6}
          className="text-4xl"
        />
      </div>

      {/* 数据获取组件 - 在服务器端获取数据并传递给展示组件 */}
      <DataFetcher>
        {({ connected, users, userCount, error, statusMessage }) => (
          <DatabaseStatus
            connected={connected}
            users={users}
            userCount={userCount}
            error={error}
            statusMessage={statusMessage}
          />
        )}
      </DataFetcher>

      {/* 客户端组件 - 会在客户端水合并运行 */}
      <EnvironmentCheck />
      <TextEllipsisDemo />
      
      {/* Loading 组件演示 */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lottie Loading 动画
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              使用 lottie-react 实现的精美加载动画
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">小尺寸</h3>
              <Loading size={50} />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">中尺寸</h3>
              <Loading size={100} />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">大尺寸</h3>
              <Loading size={150} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
