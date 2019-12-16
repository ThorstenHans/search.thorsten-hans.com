const https = require('https'),
    fs = require('fs'),
    path = require('path');

const recreateSearchIndex = (azureSearchOptions) => {
    const indexFilePath = path.join(__dirname, 'search.index.json');
    const index = JSON.parse(fs.readFileSync(indexFilePath, 'utf-8'));
    index.name = azureSearchOptions.indexName;
    
    const payload = JSON.stringify(index);
    console.dir(payload);
    const request = https.request({
        host: `${azureSearchOptions.serviceName}.search.windows.net`,
        path: `/indexes?api-version=${azureSearchOptions.apiVersion}`,
        method: 'POST',
        headers: {
            'api-key': azureSearchOptions.apiKey,
            'Connection': 'Close',
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        },
    }, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log('Response: ' + chunk);
        });
        res.on('end', () => {
            console.info('Done');
        })
    }).on('error', (e) => {
        console.warn(e);
    });
    request.write(payload);
    request.end();
}

module.exports = {
    recreate: (options) => {
        recreateSearchIndex(options.azureSearch);
    }
};