const fs = require('fs'),
    path = require('path'),
    https = require('https'),
    fronMatter = require('gray-matter'),
    removeMarkdown = require('remove-markdown');

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
            id: doc.data.permalink,
            title: doc.data.title,
            description: doc.data.excerpt,
            content: removeMarkdown(doc.content.replace(/<[^>]+>/g, ' ')),
            pubdate: new Date(doc.data.date),
            tags: doc.data.tags ? doc.data.tags.map(t => t.replace(/-/g, ' ')) : [],
            url: options.blogUrl + '/' + doc.data.permalink
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

