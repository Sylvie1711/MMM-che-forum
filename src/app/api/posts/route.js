import { NextResponse } from 'next/server';
import { getPosts, createPost } from '@/lib/db';

// Get all posts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    
    const result = await getPosts({ category, limit, page });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching posts' },
      { status: 500 }
    );
  }
}

// Create a new post
export async function POST(request) {
  try {
    const { title, content, category, authorName } = await request.json();
    
    if (!title || !content || !category || !authorName) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }
    
    const result = await createPost({
      title,
      content,
      category,
      authorName
    });
    
    if (!result.success) {
      return NextResponse.json(
        { message: result.error || 'Failed to create post' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Post created successfully', post: result.post },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { message: 'An error occurred while creating the post' },
      { status: 500 }
    );
  }
} 