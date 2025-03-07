'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (path) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2" onClick={() => navigateTo('/')}>
          <Image
            src="/MMMlogo.png"
            alt="MMMUT Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-xl font-bold">CHE MMMUT Forum</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          <button onClick={() => navigateTo('/')} className="hover:text-gray-300">Home</button>
          <button onClick={() => navigateTo('/categories')} className="hover:text-gray-300">Categories</button>
          <button onClick={() => navigateTo('/new-post')} className="hover:text-gray-300">New Post</button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <button
            onClick={() => navigateTo('/')}
            className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
          >
            Home
          </button>
          <button
            onClick={() => navigateTo('/categories')}
            className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
          >
            Categories
          </button>
          <button
            onClick={() => navigateTo('/new-post')}
            className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
          >
            New Post
          </button>
        </div>
      )}
    </nav>
  );
} 