import { TResponseRedux } from "../../types";
import { TProject } from "../../types/project";
import { baseApi } from "../api/baseApi";

const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addProject: builder.mutation({
      query: (data) => ({
        url: `project/create-project`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["project"],
    }),

    getProjects: builder.query({
      query: () => {
        return {
          url: `project/get-all-projects`,
          method: "GET",
        };
      },
      providesTags: ["project"],
      keepUnusedDataFor: 0,
      transformResponse: (response: TResponseRedux<TProject[]>) => {
        return {
          data: response?.data,
        };
      },
    }),

    updateProject: builder.mutation({
      query: (data) => ({
        url: `project/update-project`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["project"],
    }),

    deleteProject: builder.mutation({
      query: (id: string) => ({
        url: `project/delete-project/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["project"],
    }),
  }),
});

export const {
  useAddProjectMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
