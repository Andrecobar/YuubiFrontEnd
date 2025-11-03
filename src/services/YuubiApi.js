export async function getLatestMovies() {
  const POPULAR_MOVIES = "https://yuubiapi.onrender.com/api/movies";

  const rawData = await fetch(POPULAR_MOVIES);
  const json = await rawData.json();

  const { movies } = json;

  return movies.map((movie) => {
    const { id, title, description, genre, duration, poster, rating, year, } =
      movie;

    return {
      id,
      title,
      description,
      genre,
      duration,
      image: poster,
      rating,
      year,
    };
  });
}

export async function getMovieDetails(id) {
  const MOVIE_DETAILS = `https://yuubiapi.onrender.com/api/movies/${id}`;

  const rawData = await fetch(MOVIE_DETAILS);
  const json = await rawData.json();

  const movie = json.movie || json;

  const {
    title,
    description,
    genre,
    duration,
    poster,
    rating,
    year,
  } = movie;


  return {
    title,
    description,
    genre,
    duration,
    image: poster,
    rating,
    year,
  };
}