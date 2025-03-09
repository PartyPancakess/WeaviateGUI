export interface WeaviateOptions {
  host?: string;
  port?: number;
  grpcHost?: string;
  grpcPort?: number;
  apiKey?: string;
  secure?: boolean;
  skipInitChecks?: boolean;
  openaiApiKey?: string;
  weaviateContainerName?: string;
}
