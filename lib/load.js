const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
const {loadMetadata} = require('./metadata');

/**
 * Returns a string value from the specific Cloud Secret
 * @param {string} secretName
 * @param {number?} numericProjectId
 * @return {Promise <string>}
 */
module.exports.loadCloudSecret = async (secretName, numericProjectId)=>{
  let projectId;
  if (!numericProjectId) {
    projectId = await loadMetadata('project', 'numeric-project-id');
  } else {
    projectId = numericProjectId;
  }
  const client = new SecretManagerServiceClient();
  const namePath = `projects/${projectId}/secrets/` + secretName + '/versions/latest';
  try {
    const [latest] = await client.accessSecretVersion({
      name: namePath,
    });
    try {
      const jsonContent = JSON.parse(latest.payload.data.toString()); // attempt to parse as JSON content
      return jsonContent;
    } catch {
      return latest.payload.data.toString(); // fallback to string content
    }
  } catch (e) {
    console.log(e);
    throw new Error(`failed to load cloud secret: ${namePath}`);
  }
};

