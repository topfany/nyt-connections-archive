'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo 部分 */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-800">
              NYT Connections Archive
            </Link>
          </div>

          {/* 桌面端菜单 */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link href="/privacy" className="text-gray-700 hover:text-blue-600">
              Privacy Policy
            </Link>
            {/* <Link href="/how-to-play" className="text-gray-700 hover:text-blue-600">
              How to Play
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link> */}
          </div>

          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* 移动端菜单 */}
        {isOpen && (
          <div className="md:hidden">
            <div className="flex flex-col space-y-2 pb-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 p-2">
                Home
              </Link>
              <Link href="/privacy" className="text-gray-700 hover:text-blue-600 p-2">
                Privacy Policy
              </Link>
              {/* <Link href="/how-to-play" className="text-gray-700 hover:text-blue-600 p-2">
                How to Play
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 p-2">
                About
              </Link> */}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}