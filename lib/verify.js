const {loadCloudSecret} = require('./load');


/**
 * Strips authorization header syntax ('Basic', 'Bearer') and compares to a cloud secret value
 * @param {string} name
 * @param {string} token
 * @return {Promise} boolean return
 */
module.exports.verifyAuth = async (name, token) =>{
  if (token.includes('Basic ')) {
    token = token.replace('Basic ', '');
  }
  if (token.includes('Bearer ')) {
    token = token.replace('Bearer ', '');
  }
  const staticToken = await loadCloudSecret(name);
  return (token == staticToken);
};
