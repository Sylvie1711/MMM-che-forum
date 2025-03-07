'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Categories() {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categoryList = [
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
        const categoriesData = {};
        
        // Fetch posts for each category
        for (const category of categoryList) {
          const response = await fetch(`/api/posts?category=${category}&limit=5`);
          const data = await response.json();
          categoriesData[category] = data.posts;
        }
        
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error loading categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-600 p-4">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Categories</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryList.map((category) => (
            <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{category}</h2>
                
                {categories[category]?.length > 0 ? (
                  <ul className="space-y-3">
                    {categories[category].map((post) => (
                      <li key={post._id}>
                        <Link 
                          href={`/post/${post._id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline block truncate"
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No posts in this category yet</p>
                )}
                
                <Link
                  href={`/?category=${category}`}
                  className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
                >
                  View all posts in {category} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
} 