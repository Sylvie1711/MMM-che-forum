'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import Layout from '@/components/Layout';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  
  const categories = [
    'General',
    'Technology',
    'Sports',
    'events',
    'lafda/tension',
    'Exams/Notes',
    'Notice/Updates',
    'Masti/Tea',
    'Other'
  ];
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        let url = `/api/posts?page=${page}&limit=10`;
        if (category) {
          url += `&category=${category}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to load posts');
        }
        
        setPosts(data.posts);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Error loading posts:', error);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [category, page]);
  
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
  };
  
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  const handleNextPage = () => {
    if (page < pagination.pages) {
      setPage(page + 1);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            {category ? `${category} Posts` : 'Recent Posts'}
          </h1>
          
          <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                category === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  category === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading posts...</p>
            </div>
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden ${
                    post.isSticky ? 'border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="p-6">
                    <Link href={`/post/${post._id}`}>
                      <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 mb-2">
                        {post.title}
                        {post.isSticky && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            Pinned
                          </span>
                        )}
                      </h2>
                    </Link>
                    
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <span className="mr-4">Posted by {post.authorName}</span>
                      <span className="mr-4">
                        {post.createdAt && formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </span>
                      <span className="mr-4">
                        <Link href={`/?category=${post.category}`} className="hover:text-blue-600">
                          {post.category}
                        </Link>
                      </span>
                      <span>{post.views} views</span>
                      <span className="mx-4">•</span>
                      <span>{post.comments?.length || 0} comments</span>
                    </div>
                    
                    <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
                    
                    <Link
                      href={`/post/${post._id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-l-md border ${
                      page === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <div className="px-4 py-2 border-t border-b bg-white text-blue-600">
                    Page {page} of {pagination.pages}
                  </div>
                  <button
                    onClick={handleNextPage}
                    disabled={page === pagination.pages}
                    className={`px-4 py-2 rounded-r-md border ${
                      page === pagination.pages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 mb-4">No posts found in this category.</p>
            <Link href="/new-post" className="text-blue-600 hover:text-blue-800 font-medium">
              Create the first post →
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
} 