// src/services/homeService.js
const BASE = "https://yuubiapi.onrender.com";

export async function fetchHome() {
  try {
    const res = await fetch(`${BASE}/api/home`);
    if (!res.ok) throw new Error("Network response not ok");
    const json = await res.json();

    // 🔧 Normaliza los tipos según la sección
    const normalizeWithType = (arr = [], type) =>
      arr.map((item) => ({ ...item, type }));

    return {
      featured:
        json.featured?.details ||
        (json.verified_movies?.[0]
          ? { ...json.verified_movies[0], type: "movie" }
          : null),
      verified_movies: normalizeWithType(json.verified_movies, "movie"),
      trending: json.trending || [],
      popular_movies: normalizeWithType(json.popular_movies, "movie"),
      popular_series: normalizeWithType(json.popular_series, "series"),
    };
  } catch (err) {
    console.error("fetchHome error:", err);
    throw err;
  }
}

export async function fetchDetailsById(tmdb_id, type = "movie") {
  try {
    const res = await fetch(`${BASE}/api/details/${tmdb_id}?type=${type}`);
    if (!res.ok) throw new Error("Network response not ok");
    const json = await res.json();
    return json.details || json;
  } catch (err) {
    console.error("fetchDetailsById error:", err);
    throw err;
  }
}
