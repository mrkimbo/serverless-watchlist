'use strict';

const { OMDB_API_KEY, TABLE_NAME } = process.env;
const API_ENDPOINT = 'http://www.omdbapi.com/';

/**
 * lambda response format
 * @param {number} statusCode
 * @param {object} body
 * @return {object}
 */
const formatResponse = (statusCode, body) => ({
  statusCode,
  headers: {},
  isBase64Encoded: false,
  body: JSON.stringify(body || {}),
});

/**
 * Query OMDB database
 * @param {string} s search query
 * @param {number} page page number
 * @return {object}
 */
const getOMDBSearchConfig = (s, page = 1) => ({
  uri: API_ENDPOINT,
  json: true,
  qs: {
    apiKey: OMDB_API_KEY,
    page,
    s,
  }
});

/**
 * Return existence of item in the table
 * @param {string} title
 * @param {string|number} year
 * @return {Promise}
 */
async function itemExists(title, year) {
  const { Item } = await db.get(Query.find(title, year)).promise();
  return Boolean(Item);
}

/**
 * DynamoDB query helpers
 */
const Query = {
  table: () => ({ TableName: TABLE_NAME }),
  scan: () => Query.table(),
  find: (id) => ({
    Key: {
      id: { S: id },
    },
    ...Query.table(),
  }),
  add: (props) => ({
    Item: { ...props },
    ...Query.table(),
  }),
  remove: (id) => ({
    ...Query.find(id),
  }),
};

module.exports = {
  formatResponse,
  getOMDBSearchConfig,
  itemExists,
  Query,
};
