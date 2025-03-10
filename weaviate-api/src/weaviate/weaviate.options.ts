export interface WeaviateOptions {
  host?: string;
  port?: number;
  secure?: string;
  grpcHost?: string;
  grpcPort?: number;
  grpcSecure?: string;
  apiKey?: string;
  skipInitChecks?: string;
  openaiApiKey?: string;
  weaviateContainerName?: string;
}
