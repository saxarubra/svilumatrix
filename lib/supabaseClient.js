import { createClient } from '@supabase/supabase-js';

// Leggi le variabili di ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

// Verifica che le variabili siano caricate correttamente
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or key is missing in the environment variables');
}

// Crea il client Supabase
const supabase = createClient(supabaseUrl, supabaseKey, {
  // Configurazioni avanzate (opzionali)
  auth: {
    autoRefreshToken: true, // Abilita il refresh automatico del token
    persistSession: true, // Mantieni la sessione attiva anche dopo il refresh della pagina
    detectSessionInUrl: true, // Rileva la sessione nell'URL (utile per OAuth)
  },
});

// Funzioni di utilità personalizzate

/**
 * Ottieni l'utente loggato.
 * @returns {Object|null} L'oggetto utente o null se non loggato.
 */
export const getCurrentUser = () => {
  return supabase.auth.user();
};

/**
 * Verifica se l'utente è loggato.
 * @returns {boolean} True se l'utente è loggato, altrimenti false.
 */
export const isLoggedIn = () => {
  return !!supabase.auth.user();
};

/**
 * Ottieni il token JWT dell'utente loggato.
 * @returns {string|null} Il token JWT o null se non loggato.
 */
export const getJwtToken = () => {
  return supabase.auth.session()?.access_token || null;
};

/**
 * Aggiorna il token JWT.
 * @returns {Promise<void>}
 */
export const refreshToken = async () => {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) {
    console.error('Errore durante il refresh del token:', error.message);
  } else {
    console.log('Token aggiornato con successo:', data);
  }
};

/**
 * Esegui il logout dell'utente.
 * @returns {Promise<void>}
 */
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Errore durante il logout:', error.message);
  } else {
    console.log('Logout effettuato con successo');
  }
};

/**
 * Ottieni i dati di una tabella con filtri opzionali.
 * @param {string} tableName - Nome della tabella.
 * @param {Object} filters - Filtri da applicare (es. { column: 'name', value: 'John' }).
 * @returns {Promise<Array>} I dati della tabella.
 */
export const fetchTableData = async (tableName, filters = {}) => {
  let query = supabase.from(tableName).select('*');
  if (filters.column && filters.value) {
    query = query.eq(filters.column, filters.value);
  }
  const { data, error } = await query;
  if (error) {
    console.error(`Errore durante il recupero dei dati dalla tabella ${tableName}:`, error.message);
    return [];
  }
  return data;
};

/**
 * Inserisci dati in una tabella.
 * @param {string} tableName - Nome della tabella.
 * @param {Object} data - Dati da inserire.
 * @returns {Promise<Object>} Il risultato dell'inserimento.
 */
export const insertTableData = async (tableName, data) => {
  const { data: insertedData, error } = await supabase.from(tableName).insert([data]);
  if (error) {
    console.error(`Errore durante l'inserimento dei dati nella tabella ${tableName}:`, error.message);
    return null;
  }
  return insertedData;
};

// Esporta il client Supabase e le funzioni di utilità
export default supabase;