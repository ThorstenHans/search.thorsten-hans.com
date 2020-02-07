const fs = require('fs'),
    path = require('path'),
    https = require('https'),
    fronMatter = require('front-matter'),
    removeMarkdown = require('remove-markdown');


const getDateFromFilename = (filename) => {
    const year = filename.toString().substr(0,4);
    const month = filename.toString().substr(5,2);
    const day = filename.toString().substr(8,2);
    return new Date(year, month, day);
    // 2011-23-32
}
const feedSearchIndex = (allPosts, azureSearchOptions) => {
    const payload = JSON.stringify({
        value: allPosts
    });

    const request = https.request({
        host: `${azureSearchOptions.serviceName}.search.windows.net`,
        path: `/indexes/${azureSearchOptions.indexName}/docs/index?api-version=${azureSearchOptions.apiVersion}`,
        headers: {
            'api-key': azureSearchOptions.apiKey,
            'Connection': 'Close',
            'Content-Length': Buffer.byteLength(payload),
            'Content-Type': 'application/json',
        },
        method: 'POST'


    }, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log('Response: ' + chunk);
        });
        res.on('end', () => {
            console.log('Done');
        })
    }).on('error', (e) => {
        console.log(e);
    });
    request.write(payload);
    request.end();
};

const isMarkdownFile = (fileName) => {
    return !!fileName && (fileName.endsWith('.md') || fileName.endsWith('.markdown'));
};

const parsePosts = (options) => {
    const allMarkdownFiles = fs.readdirSync(options.postsFolder);
    const allPosts = [];

    allMarkdownFiles.forEach(fileName => {
        if (!isMarkdownFile(fileName)) {
            rerturn;
        }
        const markdownFile = fs.readFileSync(path.resolve(options.postsFolder, fileName), 'utf-8');
        const doc = fronMatter(markdownFile);
        allPosts.push({
            '@search.action': 'mergeOrUpload',
            id: doc.attributes.permalink,
            title: doc.attributes.title,
            description: doc.attributes.excerpt,
            content: removeMarkdown(doc.body.replace(/<[^>]+>/g, ' ')),
            pubdate: getDateFromFilename(fileName),
            tags: doc.attributes.tags ? doc.attributes.tags.map(t => t.replace(/-/g, ' ')) : [],
            url: options.blogUrl + '/' + doc.attributes.permalink
        });
    });
    return allPosts;
};

const feedIndex = (options) => {
    if (!options) {
        console.error('options not defined');
        throw new Error('options is not defined');
    }
    const allPosts = parsePosts(options);
    feedSearchIndex(allPosts, options.azureSearch);
};

module.exports = {
    feed: feedIndex
}

