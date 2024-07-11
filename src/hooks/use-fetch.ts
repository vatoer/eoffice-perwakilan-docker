"use client";
import axios from "axios";
import useSWR from "swr";

// <https://swr.vercel.app/docs/data-fetching>

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useFetch = (url: string) => {
  const { data, error, isLoading } = useSWR(url, fetcher);
  return {
    data: data,
    isLoading,
    isError: error,
  };
};
