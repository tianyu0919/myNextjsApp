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
    </>
  );
}
