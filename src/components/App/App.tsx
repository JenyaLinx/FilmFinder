import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import toast, { Toaster } from "react-hot-toast";

import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isError, isSuccess, isFetching } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const movies = data?.results ?? [];
  const totalPages = Math.min(data?.total_pages ?? 0, 500);

  useEffect(() => {
    if (isSuccess && query && movies.length === 0) {
      toast.error("No movies found.");
    }
  }, [isSuccess, movies.length, query]);

  return (
    <div className={css.app}>
      <header className={css.header}>
        <div className={css.headerContainer}>
          <a className={css.logo} href="/" aria-label="FilmFinder home">
            <span className={css.logoIcon} aria-hidden="true">
              F
            </span>

            <span className={css.logoText}>
              Film<span>Finder</span>
            </span>
          </a>

          <div className={css.headerInfo}>
  <span className={css.headerLabel}>Discover your next movie</span>

  <a
    className={css.tmdbLink}
    href="https://www.themoviedb.org/"
    target="_blank"
    rel="noreferrer"
  >
    Powered by <span>TMDB</span>
  </a>
</div>
        </div>
      </header>

      <main>
        <section className={css.hero}>
          <div className={css.heroGlow} />

          <div className={css.heroContainer}>
            <p className={css.eyebrow}>Explore the world of cinema</p>

            <h1 className={css.title}>
              Find a movie for
              <span> every mood</span>
            </h1>

            <p className={css.description}>
              Search thousands of movies and discover something worth watching.
            </p>

            <div className={css.searchWrapper}>
              <SearchBar onSubmit={handleSearch} />
            </div>
          </div>
        </section>

        <section className={css.content}>
          <div className={css.contentContainer}>
            {query && (
              <div className={css.resultsHeader}>
                <div>
                  <p className={css.resultsLabel}>Search results</p>
                  <h2 className={css.resultsTitle}>
                    Movies for “{query}”
                  </h2>
                </div>

                {movies.length > 0 && (
                  <span className={css.pageIndicator}>
                    Page {page}
                  </span>
                )}
              </div>
            )}

            {isFetching && <Loader />}

            {isError && <ErrorMessage />}

            {!query && (
              <div className={css.emptyState}>
                <div className={css.emptyIcon} aria-hidden="true">
                  🎬
                </div>

                <h2>Start your movie search</h2>

                <p>
                  Enter a movie title above to explore posters, ratings and
                  release information.
                </p>
              </div>
            )}

            {movies.length > 0 && (
              <>
                <MovieGrid
                  movies={movies}
                  onSelect={setSelectedMovie}
                />

                {totalPages > 1 && (
                  <ReactPaginate
                    pageCount={totalPages}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={1}
                    onPageChange={handlePageChange}
                    forcePage={page - 1}
                    containerClassName={css.pagination}
                    pageClassName={css.pageItem}
                    pageLinkClassName={css.pageLink}
                    previousClassName={css.navigationItem}
                    nextClassName={css.navigationItem}
                    previousLinkClassName={css.navigationLink}
                    nextLinkClassName={css.navigationLink}
                    activeClassName={css.active}
                    disabledClassName={css.disabled}
                    breakClassName={css.breakItem}
                    nextLabel="→"
                    previousLabel="←"
                  />
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <footer className={css.footer}>
        <div className={css.footerContainer}>
          <p>© 2026 FilmFinder</p>

          <p className={css.tmdbText}>
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
        </div>
      </footer>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            color: "#ffffff",
            background: "#25292d",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderRadius: "14px",
          },
        }}
      />
    </div>
  );
}