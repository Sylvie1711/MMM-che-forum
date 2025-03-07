import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');

// Check if running in production (Vercel) environment
const isProduction = process.env.NODE_ENV === 'production';

// In-memory data store for production
let inMemoryData = {
  posts: []
};

// Initialize the data directory and files if they don't exist and we're not in production
if (!isProduction) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(POSTS_FILE)) {
      fs.writeFileSync(POSTS_FILE, JSON.stringify({ posts: [] }));
    } else {
      // Load initial data into memory
      const fileData = fs.readFileSync(POSTS_FILE, 'utf8');
      inMemoryData = JSON.parse(fileData);
    }
  } catch (error) {
    console.error('Error initializing data files:', error);
  }
}

// Helper function to get data (either from file or memory)
const getData = () => {
  if (isProduction) {
    return inMemoryData;
  }
  
  try {
    return JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
  } catch (error) {
    console.error('Error reading data:', error);
    return { posts: [] };
  }
};

// Helper function to save data (either to file or memory)
const saveData = (data) => {
  if (isProduction) {
    inMemoryData = data;
    return true;
  }
  
  try {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
};

// Function to read all posts
export async function getPosts({ category = null, limit = 10, page = 1 } = {}) {
  try {
    const data = getData();
    let filteredPosts = [...data.posts];
    
    // Apply category filter if provided
    if (category) {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }
    
    // Sort posts by createdAt (newest first)
    filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Calculate total and pagination
    const total = filteredPosts.length;
    const skip = (page - 1) * limit;
    const paginatedPosts = filteredPosts.slice(skip, skip + limit);
    
    return {
      posts: paginatedPosts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error reading posts:', error);
    return { posts: [], pagination: { total: 0, page, limit, pages: 0 } };
  }
}

// Function to get a single post by ID
export async function getPostById(id) {
  try {
    const data = getData();
    return data.posts.find(post => post._id === id) || null;
  } catch (error) {
    console.error('Error reading post:', error);
    return null;
  }
}

// Function to create a new post
export async function createPost(postData) {
  try {
    const data = getData();
    
    // Create a new post with a unique ID
    const newPost = {
      _id: Date.now().toString(),
      ...postData,
      comments: [],
      views: 0,
      isSticky: false,
      isLocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add the post to the array
    data.posts.push(newPost);
    
    // Save the updated data
    const saved = saveData(data);
    
    if (!saved && isProduction) {
      console.log("Post saved in memory but not persisted (expected in production)");
    } else if (!saved) {
      return { success: false, error: 'Failed to save post data' };
    }
    
    return { success: true, post: newPost };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, error: 'Failed to create post' };
  }
}

// Function to add a comment to a post
export async function addComment(postId, commentData) {
  try {
    const data = getData();
    const postIndex = data.posts.findIndex(post => post._id === postId);
    
    if (postIndex === -1) {
      return { success: false, error: 'Post not found' };
    }
    
    const newComment = {
      _id: Date.now().toString(),
      ...commentData,
      createdAt: new Date().toISOString()
    };
    
    // Add the comment to the post
    data.posts[postIndex].comments.push(newComment);
    
    // Update the post's updatedAt field
    data.posts[postIndex].updatedAt = new Date().toISOString();
    
    // Save the updated data
    const saved = saveData(data);
    
    if (!saved && isProduction) {
      console.log("Comment saved in memory but not persisted (expected in production)");
    } else if (!saved) {
      return { success: false, error: 'Failed to save comment data' };
    }
    
    return { success: true, comment: newComment };
  } catch (error) {
    console.error('Error adding comment:', error);
    return { success: false, error: 'Failed to add comment' };
  }
}

// Function to increment post views
export async function incrementViews(postId) {
  try {
    const data = getData();
    const postIndex = data.posts.findIndex(post => post._id === postId);
    
    if (postIndex === -1) {
      return { success: false, error: 'Post not found' };
    }
    
    // Increment the views
    data.posts[postIndex].views += 1;
    
    // Save the updated data
    const saved = saveData(data);
    
    if (!saved && isProduction) {
      console.log("Views incremented in memory but not persisted (expected in production)");
    } else if (!saved) {
      return { success: false, error: 'Failed to update views' };
    }
    
    return { success: true, views: data.posts[postIndex].views };
  } catch (error) {
    console.error('Error incrementing views:', error);
    return { success: false, error: 'Failed to increment views' };
  }
} 