import React from "react";

export type TBlog = {
  key?: React.Key;
  _id: string;
  title: string;
  description: string;
  image?: string;
  photos?: string[];
  gallery?: string[];
  author: string;
  tags?: string[];
  category?: string;
  isPublished?: boolean;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
};
