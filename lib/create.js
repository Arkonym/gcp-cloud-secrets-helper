const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
const {loadMetadata} = require('./metadata');

module.exports.createNewCloudSecret = async (secretName, content)=>{
  const projectId = await loadMetadata('project', 'numeric-project-id');
  try {
    const client = new SecretManagerServiceClient();
    const [secret] = await client.createSecret({
      parent: `projects/${projectId}/secrets`,
      secretId: secretName,
      secret: {
        replication: {
          automatic: {},
        },
      },
    });
    console.log(`Created secret ${secret.name}`);
    await exports.addNewSecretVersion(secretName, content, client);
  } catch (err) {
    console.error(err);
    throw new Error(`Failed creating new secret: ${err}`);
  }
};

module.exports.addNewSecretVersion = async (secretName, content, passedClient)=>{
  const projectId = await loadMetadata('project', 'numeric-project-id');
  const projectSecretPath = `projects/${projectId}/secrets/`
  let client;
  if (passedClient != undefined) {
    client = passedClient;
  } else {
    client = new SecretManagerServiceClient();
  }
  const payload = Buffer.from(content, 'utf8');
  const [version] = await client.addSecretVersion({
    parent: projectSecretPath + secretName,
    payload: {
      data: payload,
    },
  });
  console.log(`Added secret version ${version.name}`);
};
