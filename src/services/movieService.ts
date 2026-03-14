import axios from "axios";
import type { FetchMoviesResponse } from "../types/movie";

const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export const fetchMovies = async (
  query: string,
  page = 1,
): Promise<FetchMoviesResponse> => {
  const response = await axios.get<FetchMoviesResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query,
        page,
        include_adult: false,
        language: "en-US",
      },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    },
  );

  return response.data;
};
