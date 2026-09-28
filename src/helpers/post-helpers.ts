import { createAsyncThunk } from '@reduxjs/toolkit';
import { getRestNonce, getWpRestUrl } from '@helpers/internal-links';
import { rcWindow } from '@stores/window.store';

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
      const post = await response.json();
      // WordPress stores the not-yet-saved "Add New" post as an `auto-draft` titled "Auto Draft"
      // and blanks that placeholder before rendering the editor; mirror it so the placeholder
      // never seeds the SEO title or the SERP preview.
      if (post?.status === 'auto-draft' && post.title) {
        post.title = { ...post.title, rendered: '' };
      }
      return post;
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('An unknown error occurred');
    }
  }
);

/**
 * True while the post being edited is still the empty `auto-draft` WordPress inserts for the
 * "Add New" screen. The block editor store reports the live status (it becomes `draft` on the
 * first save, without a reload); the classic editor reloads on save, so the flag PHP localized
 * for the page is enough there.
 */
export const isUnsavedNewPost = (): boolean => {
  const editorStatus =
    typeof wp !== 'undefined' ? wp?.data?.select?.('core/editor')?.getCurrentPost?.()?.status : undefined;
  if (typeof editorStatus === 'string' && editorStatus !== '') {
    return editorStatus === 'auto-draft';
  }
  return !!rcWindow?.rankingCoachReactData?.isAddingPost;
};


