// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const baseApi = createApi({
//   reducerPath: "baseApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "https://amar-shop-server-one.vercel.app/api",
//   }),
//   tagTypes: ["category"],
//   endpoints: () => ({}),
// });

import {
  BaseQueryApi,
  BaseQueryFn,
  DefinitionType,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { toast } from "sonner";
import { logout, setUser } from "../features/auth/authSlice";

interface ErrorData {
  message: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("authorization", `${token}`);
    }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    const errorData = result.error.data as ErrorData;

    if (result.error.status === 404) {
      toast.error(errorData.message);
    }
    if (result.error.status === 403) {
      toast.error(errorData.message);
    }
    if (result.error.status === 400) {
      toast.error(errorData.message);
    }
    if (result.error.status === 401) {
      //* Send Refresh
      // console.log("Sending refresh token");

      const res = await fetch("http://localhost:5000/api/auth/refresh-token", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (data?.data?.accessToken) {
        const user = (api.getState() as RootState).auth.user;

        api.dispatch(
          setUser({
            user,
            token: data.data.accessToken,
          })
        );

        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["blog", "user", "project"],
  endpoints: () => ({}),
});
