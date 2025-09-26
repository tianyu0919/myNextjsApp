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

export default function Home() {
  // 首页组件现在非常简洁，只负责组装不同类型的组件
  return (
    <>
      {/* 服务端组件 - 直接在服务器端渲染 */}
      <HeroSection />
      <FeaturesSection />

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
