'use strict';

/**
 * lambda response format
 * Required to avoid: "Malformed Lambda proxy response" error from API Gateway
 *
 * @param {number} statusCode
 * @param {object} body
 * @return {object}
 */
const formatResponse = (statusCode, body = null) => ({
  statusCode,
  headers: {},
  isBase64Encoded: false,
  body: body ? JSON.stringify(body) : undefined,
});

/**
 * Standard 200 response with optional body
 * @param {object?} body
 * @return {object}
 */
const ok = (body) => formatResponse(200, body);

/**
 * Standard 500 response helper with default message
 * @param {string?} error
 * @return {object}
 */
const error = (error = 'The operation failed') => formatResponse(500, { error });

/**
 * Standard 400 response helper
 * @param {string?} error
 * @return {object}
 */
const badRequest = (error) => formatResponse(400, { error });

/**
 * Custom response with optional body
 * @param {object?} body
 * @return {object}
 */
const custom = (status, body) => formatResponse(status, body);


module.exports = {
  ok,
  error,
  badRequest,
  custom,
};
