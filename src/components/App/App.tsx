import { useState, type FC } from "react";
import { Toaster } from "react-hot-toast";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import type { Movie } from "../../types/movie";
import {
  fetchMovies,
  type FetchMoviesResponse,
} from "../../services/movieService";

import css from "./App.module.css";

const Paginate =
  (ReactPaginate as unknown as { default: typeof ReactPaginate }).default ||
  ReactPaginate;

const App: FC = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery<FetchMoviesResponse>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim() !== "",

    placeholderData: keepPreviousData,
  });

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={css.appContainer}>
      <Toaster position="top-right" />

      <SearchBar onSubmit={handleSearch} />

      <main>
        {isError && <ErrorMessage />}

        {isLoading && <Loader />}

        {data && data.results.length === 0 && query !== "" && !isLoading && (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No movies found for your query.
          </p>
        )}

        {data && data.results.length > 0 && (
          <>
            <MovieGrid movies={data.results} onSelect={setSelectedMovie} />

            {data.total_pages > 1 && (
              <Paginate
                pageCount={data.total_pages > 500 ? 500 : data.total_pages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={handlePageChange}
                forcePage={page - 1}
                containerClassName={css.pagination}
                activeClassName={css.active}
                nextLabel="→"
                previousLabel="←"
              />
            )}
          </>
        )}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default App;
