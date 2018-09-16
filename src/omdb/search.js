import axios from 'axios';
import response from '../response';

const { OMDB_API_KEY } = process.env;
const API_ENDPOINT = 'http://www.omdbapi.com/';

/**
 * Query OMDB database
 * @param {string} query search term
 * @param {number} page page number
 * @return {object}
 */
const getSearchParams = (query, page = 1) => ({
  params: {
    apiKey: OMDB_API_KEY,
    s: decodeURIComponent(query),
    page,
  }
});

/**
 * Search for movies
 * Expects request in format: /search/{query}/{page}
 */
module.exports.handler = async ({ pathParameters = {} }, context, callback) => {
  const { query } = pathParameters;
  const page = parseInt(pathParameters.page || 1);
  
  if (!query) {
    callback(null, response.badRequest('Missing query parameter'));
    return;
  }
  
  const payload = {
    results: [],
  };
  
  try {
    const { data } = await axios(API_ENDPOINT, getSearchParams(query, page));
    const totalPages = Math.ceil(data.totalResults / 10);
    payload.results = data.Search;
    payload.next = page < totalPages ? `/omdb/search/${query}/${page + 1}` : null;
    payload.prev = page > 1 ? `/omdb/search/${query}/${page - 1}` : null;
    payload.totalPages = totalPages;
    
  } catch (err) {
    console.error(err);
  }
  
  callback(null, response.ok(payload));
};
