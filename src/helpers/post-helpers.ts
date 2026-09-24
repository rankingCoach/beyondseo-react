import { createAsyncThunk } from '@reduxjs/toolkit';
import { getRestNonce, getWpRestUrl } from '@helpers/internal-links';

export interface Post {
  id: number;
  date: string;
  slug: string;
  type: string;
  status: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    filtered: string;
    protected: boolean;
  };
  author: number;
  categories: number[];
  tags: number[];
  // Add other fields as needed
}

// Explicitly type the `postId` parameter
export const fetchPost = createAsyncThunk<
  any, // Replace `any` with the expected return type of the API response
  { postId: number; postType: string }, // Type of the argument passed to the thunk (postId),
  { rejectValue: string } // Type for rejected value
>(
  'post/fetchPost',
  async ({ postId, postType }, thunkAPI) => {
    try {
      const response = await fetch(getWpRestUrl(`wp/v2/${postType}s/${postId}`, { _ref: 'rc' }), {
        method: 'GET',
        headers: {
          'X-WP-Nonce': getRestNonce()
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('An unknown error occurred');
    }
  }
);


