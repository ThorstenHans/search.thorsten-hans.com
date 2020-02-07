const https = require('https'),
    fs = require('fs'),
    path = require('path');

const deleteIndex = (azureSearchOptions) => {
    return new Promise((resolve, reject)=> {
        const request = https.request({
            host: `${azureSearchOptions.serviceName}.search.windows.net`,
            path: `/indexes/${azureSearchOptions.indexName}?api-version=${azureSearchOptions.apiVersion}`,
            method: 'DELETE',
            headers: {
                'api-key': azureSearchOptions.apiKey,
                'Connection': 'Close',
                'Content-Type': 'application/json'
            },
        }, (res) => {
                if(res.statusCode < 200 || res.statusCode > 299){
                    return reject(res.statusCode);
                }
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    console.log('Response: ' + chunk);
                });
                res.on('end', () => {
                    console.info('Done');
                    return resolve();
                });
            }).on('error', (e) => {
                console.warn(e);
                return reject(e);
            });
        request.end();
        });
};

const buildIndex = (azureSearchOptions) => {
    return new Promise((resolve, reject)=> {
        const indexFilePath = path.join(__dirname, 'search.index.json');
        const index = JSON.parse(fs.readFileSync(indexFilePath, 'utf-8'));
        index.name = azureSearchOptions.indexName;
        const payload = JSON.stringify(index);
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
            if(res.statusCode < 200 || res.statusCode > 299){
                    return reject(res.statusCode);
            }
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log('Response: ' + chunk);
            });
            res.on('end', () => {
                console.info('Done');
                return resolve();
            })
        }).on('error', (e) => {
            console.warn(e);
            return reject(e);
        });
        request.write(payload);
        request.end();
    });
}

module.exports = {
    build: (options) => {
        return buildIndex(options.azureSearch);
    },
    del: (options) => {
        return deleteIndex(options.azureSearch)
    }
};
