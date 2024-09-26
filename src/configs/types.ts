interface ConfigInterface {
  api: ApiConfigInterface;
  port: number;
}

interface ApiConfigInterface {
  path: string;
  version?: number;
}

export { ConfigInterface, ApiConfigInterface };
