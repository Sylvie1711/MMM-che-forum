import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import Post from '@/models/Post';

// Update a comment
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const comment = await Comment.findById(params.commentId);
    
    if (!comment) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }
    
    const { content, authorName } = await request.json();
    
    if (!content || !authorName) {
      return NextResponse.json(
        { message: 'Please provide comment content and author name' },
        { status: 400 }
      );
    }
    
    comment.content = content;
    comment.authorName = authorName;
    comment.isEdited = true;
    await comment.save();
    
    return NextResponse.json({
      message: 'Comment updated successfully',
      comment
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating the comment' },
      { status: 500 }
    );
  }
}

// Delete a comment
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const comment = await Comment.findById(params.commentId);
    
    if (!comment) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }
    
    // Remove comment from post's comments array
    await Post.findByIdAndUpdate(params.id, {
      $pull: { comments: params.commentId }
    });
    
    await Comment.findByIdAndDelete(params.commentId);
    
    return NextResponse.json({
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { message: 'An error occurred while deleting the comment' },
      { status: 500 }
    );
  }
} 