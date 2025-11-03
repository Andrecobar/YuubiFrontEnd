export async function fetchSeason(tmdb_id, season = 1) {
    const API_URL = `https://yuubiapi.onrender.com/api/series/${tmdb_id}/season/${season}`;
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener temporada");
    return await res.json();
  }
  