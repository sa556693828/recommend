import type { NextConfig } from "next";

// 添加開發環境判斷
const inDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // 添加 assetPrefix 配置
  assetPrefix: inDevelopment ? undefined : "/",
  experimental: {
    turbo: {
      rules: {
        "src/app/**/*": [], // 只包含 src 目錄內的文件
        "src/components/**/*": [], // 只包含 src 目錄內的文件
        "node_modules/**": false, // 排除 node_modules
        ".git/**": false, // 排除 git 文件
      },
    },
  },
};

export default nextConfig;
