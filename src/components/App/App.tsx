import { useState, type FC } from "react";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import type { Movie, FetchMoviesResponse } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";

import css from "./App.module.css";

const App: FC = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery<FetchMoviesResponse>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim() !== "",
  });

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  return (
    <>
      <Toaster position="top-right" />

      <SearchBar onSubmit={handleSearch} />

      <main>
        {isError && <ErrorMessage />}

        {isLoading && <Loader />}

        {data && data.results.length === 0 && query !== "" && (
          <p>No movies found for your query.</p>
        )}

        {data && data.results.length > 0 && (
          <>
            <MovieGrid movies={data.results} onSelect={setSelectedMovie} />

            {data.total_pages > 1 && (
              <ReactPaginate
                pageCount={data.total_pages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={handlePageChange}
                forcePage={page - 1}
                containerClassName={css.pagination}
                activeClassName={css.active}
                nextLabel=">"
                previousLabel="<"
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
    </>
  );
};

export default App;
