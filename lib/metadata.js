const gcpMetadata = require('gcp-metadata');

/**
 * Returns metadata attributes for either instance or project. Field value optional.
 * @param {instance | project} datasource
 * @param {string} field
 * @return {Promise <Object | string>}
 */
module.exports.loadMetadata = async (datasource, field) =>{
  const isAvailable = await gcpMetadata.isAvailable();
  if (!isAvailable) {
    throw new Error('metadata service is not available. Cannot determine project.');
  }
  try {
    switch (datasource) {
      case 'instance':
        if (field) {
          return await gcpMetadata.instance(field);
        } else {
          return await gcpMetadata.instance();
        }
      case 'project':
        if (field) {
          return await gcpMetadata.project(field);
        } else {
          return await gcpMetadata.project();
        }
    }
  } catch (e) {
    console.log('error loading metadata');
    console.error(e.toString());
  }
};
