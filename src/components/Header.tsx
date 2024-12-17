import Link from "next/link";
import React from "react";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-[52px]">
          {/* Logo/網站名稱 */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-black text-base font-medium">
              /book-recommendation-agent
            </Link>
          </div>

          {/* 導航選項 */}
          <nav className="flex space-x-4">
            <FaUserCircle className="text-black text-xl" />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
