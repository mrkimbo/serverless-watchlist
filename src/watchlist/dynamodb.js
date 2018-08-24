const AWS = require('aws-sdk');

const { TABLE_NAME } = process.env;
const db = new AWS.DynamoDB.DocumentClient();

/** Query config builders */
const config = {
  table: () => ({ TableName: TABLE_NAME }),
  
  // list items
  list: () => config.table(),
  
  // find an item
  find: (id) => ({
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': id,
    },
    ...config.table(),
  }),
  
  // add an item
  add: (props) => ({
    Item: { ...props },
    ...config.table(),
  }),
  
  // remove an item
  remove: (id) => ({
    Key: {
      id,
    },
    ...config.table(),
  }),
};

/**
 * Helper to execute a table action and trap errors
 * @param {string} action
 * @param {object} query
 * @return {Promise}
 */
const exec = (action, query) => {
  console.log(action, query);
  return db[action](query).promise();
};

module.exports = {
  list: () => exec('scan', config.list()),
  add: (props) => exec('put', config.add(props)),
  find: (id) => exec('query', config.find(id)),
  remove: (id) => exec('delete', config.remove(id)),
};
