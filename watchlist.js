'use strict';

const request = require('request-promise');
const AWS = require('aws-sdk');
const { formatResponse, getOMDBSearchConfig, itemExists, Query } = require('./util');

const db = new AWS.DynamoDB.DocumentClient();
const stdErr = (error = 'The operation failed') => formatResponse(500, { error });

/**
 * Search for movies
 */
module.exports.search = async ({ queryStringParameters }, context, callback) => {
  const { q, page } = queryStringParameters || {};
  if (!q) {
    console.log('Missing query parameter');
    callback(null, formatResponse(400, { message: 'Missing query parameter' }));
    return;
  }

  try {
    console.log(`Executing search: ${q}`);
    const result = await request(getOMDBSearchConfig(q, page));
    callback(null, formatResponse(200, result.Search));

  } catch (err) {
    console.log(err.message);
    callback(null,);
  }
};

/**
 * Get all watchlist items
 */
module.exports.list = async ({ queryStringParameters }, context, callback) => {
  try {
    const result = await db.scan(Query.scan()).promise();
    callback(null, formatResponse(200, result.Items || []));

  } catch (err) {
    callback(null, stdErr(err.message));
  }
};

/**
 * Add a new item to the watchlist
 */
module.exports.add = async ({ queryStringParameters }, context, callback) => {
  const { id, title, genre, year } = queryStringParameters;

  // check for duplicates
  if (await itemExists(id)) {
    callback(null, formatResponse(400, { message: "Item exists" }));
    return;
  }

  const item = { id, title, genre, year };
  try {
    await db.put(Query.add(item)).promise();
    callback(null, formatResponse(200));

  } catch (err) {
    callback(null, stdErr());
  }
};

/**
 * Remove an item from the watchlist
 */
module.exports.remove = async ({ queryStringParameters }, context, callback) => {
  const { id } = queryStringParameters;

  try {
    await db.delete(Query.remove(id)).promise();
    callback(null, formatResponse(200));

  } catch (err) {
    callback(null, stdErr());
  }
};
