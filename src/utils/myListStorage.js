// src/utils/myListStorage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "mylist_";
const DEFAULT_USER = "default"; // cambia si implementas usuarios frontend

function keyFor(userId = DEFAULT_USER) {
  return `${PREFIX}${userId}`;
}

/**
 * Normaliza un item que guardaremos:
 * { tmdb_id, type, poster, title } (guardamos lo mínimo necesario)
 */
function normalizeItem(item) {
  return {
    tmdb_id: item.tmdb_id ?? item.id,
    type: item.type ?? item.media_type ?? (item.seasons ? "series" : "movie"),
    poster: item.poster || item.backdrop || item.image || item.poster_path || "",
    title: item.title || item.name || "",
  };
}

export async function getMyList(userId = DEFAULT_USER) {
  try {
    const raw = await AsyncStorage.getItem(keyFor(userId));
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("getMyList error", e);
    return [];
  }
}

export async function isInMyList(tmdb_id, userId = DEFAULT_USER) {
  const list = await getMyList(userId);
  return list.some((i) => i.tmdb_id === tmdb_id);
}

export async function addToMyList(item, userId = DEFAULT_USER, limit = 5) {
  try {
    const normalized = normalizeItem(item);
    let list = await getMyList(userId);

    // Si ya está, lo movemos al final (actualizamos orden)
    list = list.filter((i) => i.tmdb_id !== normalized.tmdb_id);

    // Si excede límite, remover primero (FIFO)
    if (list.length >= limit) {
      list.shift();
    }

    list.push(normalized);
    await AsyncStorage.setItem(keyFor(userId), JSON.stringify(list));
    return list;
  } catch (e) {
    console.error("addToMyList error", e);
    throw e;
  }
}

export async function removeFromMyList(tmdb_id, userId = DEFAULT_USER) {
  try {
    let list = await getMyList(userId);
    list = list.filter((i) => i.tmdb_id !== tmdb_id);
    await AsyncStorage.setItem(keyFor(userId), JSON.stringify(list));
    return list;
  } catch (e) {
    console.error("removeFromMyList error", e);
    throw e;
  }
}
