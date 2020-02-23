
export interface IGapiOptions{
    CLIENT_ID: string;
    API_KEY: string;
    /**
     * Array of API discovery doc URLs for APIs used by the quickstart
     */
    DISCOVERY_DOCS: string[];
    /**
     * Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
     */
    SCOPES: string;
}