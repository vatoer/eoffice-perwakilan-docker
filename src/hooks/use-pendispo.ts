"use client";
import axios from "axios";
import useSWR from "swr";

// <https://swr.vercel.app/docs/data-fetching>

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const usePendispo = () => {
  const { data, error, isLoading } = useSWR("/api/edispo/pendispo", fetcher);
  return {
    data: data,
    isLoading,
    isError: error,
  };
};
