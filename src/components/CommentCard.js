'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';

export default function CommentCard({ comment, onReply, onLike, onEdit, onDelete }) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  
  const isAuthor = session?.user?.id === comment.author._id;
  const hasLiked = comment.likes.includes(session?.user?.id);
  
  const handleEdit = () => {
    if (editedContent.trim() === '') return;
    
    onEdit(comment._id, editedContent);
    setIsEditing(false);
  };
  
  const handleReply = () => {
    if (replyContent.trim() === '') return;
    
    onReply(comment._id, replyContent);
    setReplyContent('');
    setShowReplyForm(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-start space-x-3">
        <img
          src={comment.author.avatar || '/default-avatar.png'}
          alt={comment.author.username}
          className="w-10 h-10 rounded-full"
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{comment.author.username}</h4>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                {comment.isEdited && ' (edited)'}
              </p>
            </div>
            
            {isAuthor && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
                <button
                  onClick={() => onDelete(comment._id)}
                  className="text-sm text-gray-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-gray-700">{comment.content}</p>
          )}
          
          <div className="mt-3 flex items-center space-x-4">
            <button
              onClick={() => onLike(comment._id)}
              className={`flex items-center text-sm ${
                hasLiked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill={hasLiked ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {comment.likes.length} {comment.likes.length === 1 ? 'Like' : 'Likes'}
            </button>
            
            {session && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center text-sm text-gray-500 hover:text-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
                Reply
              </button>
            )}
          </div>
          
          {showReplyForm && (
            <div className="mt-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  onClick={() => setShowReplyForm(false)}
                  className="px-3 py-1 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Reply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 