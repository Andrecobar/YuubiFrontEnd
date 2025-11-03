export async function fetchDetails(tmdb_id, type = "movie") {
    const API_URL = `https://yuubiapi.onrender.com/api/details/${tmdb_id}?type=${type}`;
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener detalles");
    return await res.json();
  }
  