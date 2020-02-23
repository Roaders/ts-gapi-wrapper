
export interface IGapiOptions{
    apiKey: string;
    clientId: string;
    /**
     * Array of API discovery doc URLs for APIs used by the quickstart
     */
    discoveryDocs: string[];
    /**
     * Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
     */
    scope: string;
}