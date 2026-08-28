import { TResponseRedux } from "../../types";
import { TBlog } from "../../types/blog";
import { baseApi } from "../api/baseApi";

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addBlog: builder.mutation({
      query: (data) => ({
        url: `blog/create-blog`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["blog"],
    }),

    getBlogs: builder.query({
      query: (params?: Record<string, unknown> | null) => {
        return {
          url: `blog/get-all-blogs`,
          method: "GET",
          params: params || undefined,
        };
      },
      providesTags: ["blog"],
      keepUnusedDataFor: 0,
      transformResponse: (response: TResponseRedux<TBlog[]>) => {
        return {
          data: response?.data,
        };
      },
    }),

    updateBlog: builder.mutation({
      query: (data) => ({
        url: `blog/update-blog`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["blog"],
    }),

    togglePublishBlog: builder.mutation({
      query: (id: string) => ({
        url: `blog/toggle-publish/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["blog"],
    }),

    deleteBlog: builder.mutation({
      query: (id: string) => ({
        url: `blog/delete-blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blog"],
    }),
  }),
});

export const {
  useAddBlogMutation,
  useGetBlogsQuery,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
  useTogglePublishBlogMutation,
} = blogApi;
