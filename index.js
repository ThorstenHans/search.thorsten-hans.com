const path = require('path'),
    feeder = require('./lib/feed.index'),
    creater = require('./lib/recreate.index');


const postsFolderName = process.env.THNS__POSTS_FOLDER_NAME;
const postsFolder = path.join(__dirname, postsFolderName)
const blogUrl = process.env.THNS__BLOG_URL;
const azureSearchAdminKey = process.env.THNS__AZ_SEARCH_ADMIN_KEY;
const azureSearchServiceName = process.env.THNS__AZ_SEARCH_SERVICE_NAME;
const azureSearchIndexName = process.env.THNS__AZ_SEARCH_INDEX_NAME;

if (!postsFolderName || !blogUrl || !azureSearchAdminKey || !azureSearchServiceName || !azureSearchIndexName) {
    console.warn('Please specify all required ENV VARS');
    console.info('\tTHNS__POSTS_FOLDER_NAME');
    console.info('\tTHNS__BLOG_URL');
    console.info('\tTHNS__AZ_SEARCH_ADMIN_KEY');
    console.info('\tTHNS__AZ_SEARCH_SERVICE_NAME');
    console.info('\tTHNS__AZ_SEARCH_INDEX_NAME');
    process.exit(-1);
}
const options = {
    postsFolder: postsFolder,
    blogUrl: blogUrl,
    azureSearch: {
        serviceName: azureSearchServiceName,
        indexName: azureSearchIndexName,
        apiKey: azureSearchAdminKey,
        apiVersion: '2019-05-06'
    }
};

const currentArgs = process.argv.slice(2);

switch (currentArgs[0]) {
    case 'feed':
        console.info('Feeding existing search index...');
        feeder.feed(options);
        break;
    case 'build':
        console.info('Building Index for Azure Cognitive Search...');
        creater.recreate(options);
        break;
    default:
        console.info(`Please specify a supported commend (feed or recreate)`);
        process.exit(-1);
}
