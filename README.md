# Azure Cognitive Search for my personal blog

This repo contains all required assets to create an Index and feed this Index in Azure Cognitive Search for my personal blog.

## Usage

The Docker Image can be configured using environment variables prefixed with `THNS__`. 

During Image build time, the original blog repository will be pulled and all posts will be pushed to the existing Index.

Sensitive configuration data - such as Search Service Name and Search API Key is consumed from a configurable Azure KeyVault instance that should be attached using a MSI.

If you want to use the service with a different Search Service Instance, change the `acrtask.yml` to pull secrets from your instance.

Further details will be available on my blog.