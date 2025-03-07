import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please provide content'],
    trim: true
  },
  authorName: {
    type: String,
    required: [true, 'Please provide author name'],
    trim: true,
    maxLength: 50
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  isEdited: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema); 