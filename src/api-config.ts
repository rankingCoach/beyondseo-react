export enum ActiveEnvs {
  local = "local",
  dev = "dev",
  test = "test",
  prod = "prod",
}

type ApiConfigType = {
  authBase: string;
  apiBase: string;
};

export const ApiConfig = (env: ActiveEnvs = ActiveEnvs.dev): ApiConfigType => {
  const activeConfigs: { [key: string]: () => ApiConfigType } = {
    local: (): ApiConfigType => {
      const base = ``;

      return {
        authBase: `${base}`,
        apiBase: `${base}`
      };
    },
    dev: (): ApiConfigType => {
      const base = ``;

      return {
        authBase: `${base}`,
        apiBase: `${base}`
      };
    },

    test: (): ApiConfigType => {
      const base = ``;

      return {
        authBase: `${base}`,
        apiBase: `${base}`
      };
    },
  };

  return activeConfigs[env]();
};

export const apiConfig = ApiConfig(ActiveEnvs.dev);

export class EndPoint {
  base: string;
  endPoint: string;

  constructor(endPoint: string, base: string = apiConfig.apiBase) {
    this.base = base;
    this.endPoint = endPoint;
  }

  get(): string {
    return `${this.base}${this.endPoint}`;
  }
}
