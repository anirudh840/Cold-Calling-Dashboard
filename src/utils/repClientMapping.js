// Mapping of rep names to their associated clients
export const REP_CLIENT_MAPPING = {
  'Tom': 'NewCo Capital',
  'Bryan': 'NewCo Capital',
  'Afif': 'Baton Market',
  'Alex': 'Baton Market',
  'Mario': 'Kodem Security',
};

/**
 * Maps a rep name to a client name
 * @param {string} repName - The rep name from the sheet
 * @returns {string|null} - The client name or null if not found
 */
export function getClientFromRepName(repName) {
  if (!repName) return null;
  
  // Check if rep name contains any of the mapped names
  for (const [rep, client] of Object.entries(REP_CLIENT_MAPPING)) {
    if (repName.includes(rep)) {
      return client;
    }
  }
  
  return null;
}

/**
 * Gets all reps for a specific client
 * @param {string} clientName - The client name
 * @returns {string[]} - Array of rep names
 */
export function getRepsForClient(clientName) {
  return Object.entries(REP_CLIENT_MAPPING)
    .filter(([_, client]) => client === clientName)
    .map(([rep, _]) => rep);
}


