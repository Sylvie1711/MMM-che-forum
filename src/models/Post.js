import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    trim: true
  },
  authorName: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['General', 'Technology', 'Sports', 'Entertainment', 'Politics', 'Science', 'Other'],
    default: 'General'
  },
  comments: [{
    content: {
      type: String,
      required: true,
      trim: true
    },
    authorName: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  isSticky: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', PostSchema); 