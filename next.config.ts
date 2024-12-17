import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
