import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import { authOptions } from '../../../../auth/[...nextauth]/route';

// Update a comment
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const comment = await Comment.findById(params.commentId);
    
    if (!comment) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the author
    if (comment.author.toString() !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json(
        { message: 'Not authorized to update this comment' },
        { status: 403 }
      );
    }
    
    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { message: 'Please provide comment content' },
        { status: 400 }
      );
    }
    
    comment.content = content;
    comment.isEdited = true;
    await comment.save();
    
    await comment.populate('author', 'username avatar');
    
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
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const comment = await Comment.findById(params.commentId);
    
    if (!comment) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the author or admin
    if (comment.author.toString() !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json(
        { message: 'Not authorized to delete this comment' },
        { status: 403 }
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