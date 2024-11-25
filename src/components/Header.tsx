import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="bg-[#FDF9F0] border-b border-[#E8DFC9] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/網站名稱 */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-[#4A5B6B] text-xl font-bold">
              智慧書籍推薦
            </Link>
          </div>

          {/* 導航選項 */}
          <nav className="flex space-x-4">
            <Link
              href="/"
              className="text-[#6B7C8C] hover:text-[#479bd7] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              首頁
            </Link>
            <Link
              href="/recommendations"
              className="text-[#6B7C8C] hover:text-[#479bd7] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              推薦列表
            </Link>
            <Link
              href="/analysis"
              className="text-[#6B7C8C] hover:text-[#479bd7] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              數據分析
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
