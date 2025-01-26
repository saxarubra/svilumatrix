import supabase from './supabaseClient';

/**
 * Effettua il login con email e password.
 * @param {string} email - L'email dell'utente.
 * @param {string} password - La password dell'utente.
 * @returns {Promise<{ user: any, error: string | null }>} L'utente loggato e l'eventuale errore.
 */
export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data?.user || null, error: error ? error.message : null };
};

/**
 * Effettua la registrazione con email e password.
 * @param {string} email - L'email dell'utente.
 * @param {string} password - La password dell'utente.
 * @returns {Promise<{ user: any, error: string | null }>} L'utente registrato e l'eventuale errore.
 */
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { user: data?.user || null, error: error ? error.message : null };
};

/**
 * Effettua il logout dell'utente.
 * @returns {Promise<{ error: string | null }>} L'eventuale errore.
 */
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  return { error: error ? error.message : null };
};

/**
 * Ottieni l'utente loggato.
 * @returns {any} L'utente loggato o null se non loggato.
 */
export const getCurrentUser = () => {
  return supabase.auth.getUser();
};

/**
 * Verifica se l'utente è loggato.
 * @returns {boolean} True se l'utente è loggato, altrimenti false.
 */
export const isLoggedIn = async () => {
  return !!(await supabase.auth.getUser()).data.user;
};

/**
 * Ottieni il token JWT dell'utente loggato.
 * @returns {string | null} Il token JWT o null se non loggato.
 */
export const getJwtToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
};

/**
 * Aggiorna il token JWT.
 * @returns {Promise<{ data: any, error: string | null }>} I dati aggiornati e l'eventuale errore.
 */
export const refreshToken = async () => {
  const { data, error } = await supabase.auth.refreshSession();
  return { data, error: error ? error.message : null };
};