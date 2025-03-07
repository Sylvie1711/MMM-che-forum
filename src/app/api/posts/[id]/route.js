import { NextResponse } from 'next/server';
import { getPostById, incrementViews, addComment } from '@/lib/db';

// Get a single post by ID
export async function GET(request, { params }) {
  try {
    const id = params.id;
    const post = await getPostById(id);
    
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Increment views
    await incrementViews(id);
    
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching the post' },
      { status: 500 }
    );
  }
}

// Add a comment to a post
export async function POST(request, { params }) {
  try {
    const id = params.id;
    const { content, authorName } = await request.json();
    
    if (!content || !authorName) {
      return NextResponse.json(
        { message: 'Please provide comment content and author name' },
        { status: 400 }
      );
    }
    
    const result = await addComment(id, { content, authorName });
    
    if (!result.success) {
      return NextResponse.json(
        { message: result.error || 'Failed to add comment' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Comment added successfully', comment: result.comment },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { message: 'An error occurred while adding the comment' },
      { status: 500 }
    );
  }
} 