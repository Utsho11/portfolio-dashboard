import { TResponseRedux, TUserDetails } from "../../types";
import { baseApi } from "../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
    }),

    getMe: builder.query({
      query: () => {
        return { url: "/auth/get-me", method: "GET" };
      },
      providesTags: ["blog"],
      keepUnusedDataFor: 0,
      transformResponse: (response: TResponseRedux<TUserDetails>) => {
        return {
          data: response?.data,
        };
      },
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery } = authApi;
