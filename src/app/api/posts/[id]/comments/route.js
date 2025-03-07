import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Comment from '@/models/Comment';

// Get comments for a post
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const comments = await Comment.find({ post: params.id })
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching comments' },
      { status: 500 }
    );
  }
}

// Create a new comment
export async function POST(request, { params }) {
  try {
    const { content, authorName, parentComment } = await request.json();
    
    if (!content || !authorName) {
      return NextResponse.json(
        { message: 'Please provide comment content and author name' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Check if post exists
    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Create comment
    const comment = await Comment.create({
      content,
      authorName,
      post: params.id,
      parentComment: parentComment || null
    });
    
    // Add comment to post's comments array
    await Post.findByIdAndUpdate(params.id, {
      $push: { comments: comment._id }
    });
    
    return NextResponse.json(
      { message: 'Comment created successfully', comment },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { message: 'An error occurred while creating the comment' },
      { status: 500 }
    );
  }
} 