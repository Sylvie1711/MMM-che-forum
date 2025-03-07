'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import Layout from '@/components/Layout';

export default function PostDetail({ params }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [commentAuthorName, setCommentAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/posts/${params.id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to load post');
        }
        
        setPost(data.post);
      } catch (error) {
        console.error('Error loading post:', error);
        setError('Failed to load the post. It may have been deleted or does not exist.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [params.id]);
  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!comment.trim() || !commentAuthorName.trim()) {
      setCommentError('Please provide both your name and a comment');
      return;
    }
    
    try {
      setSubmitting(true);
      setCommentError('');
      
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment,
          authorName: commentAuthorName
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add comment');
      }
      
      // Refresh post data to show new comment
      const updatedPostResponse = await fetch(`/api/posts/${params.id}`);
      const updatedPostData = await updatedPostResponse.json();
      
      setPost(updatedPostData.post);
      setComment('');
      setCommentError('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setCommentError(error.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleNavigateHome = () => {
    router.push('/');
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading post...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={handleNavigateHome}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to home
          </button>
        </div>
      </Layout>
    );
  }
  
  if (!post) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            Post not found
          </div>
          <button
            onClick={handleNavigateHome}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to home
          </button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={handleNavigateHome}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </button>
        </div>
        
        <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
            
            <div className="flex items-center text-gray-500 text-sm mb-6">
              <span className="mr-4">Posted by {post.authorName}</span>
              <span className="mr-4">
                {post.createdAt && formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
              <span className="mr-4">Category: {post.category}</span>
              <span>{post.views} views</span>
            </div>
            
            <div className="prose max-w-none mb-6">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>
          </div>
        </article>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments</h2>
          
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <div key={comment._id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center mb-2">
                    <div>
                      <p className="font-medium">{comment.authorName}</p>
                      <p className="text-gray-500 text-sm">
                        {comment.createdAt && formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          )}
        </section>
        
        <section className="bg-white rounded-lg shadow-md overflow-hidden p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add a Comment</h2>
          
          {commentError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {commentError}
            </div>
          )}
          
          <form onSubmit={handleSubmitComment}>
            <div className="mb-4">
              <label htmlFor="commentAuthorName" className="block text-gray-700 font-medium mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="commentAuthorName"
                value={commentAuthorName}
                onChange={(e) => setCommentAuthorName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="comment" className="block text-gray-700 font-medium mb-2">
                Comment
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Write your comment here..."
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Comment'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </Layout>
  );
} 