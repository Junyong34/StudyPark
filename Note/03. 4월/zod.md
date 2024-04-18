```
// config.ts
import { createContext } from "react";
import { z } from "zod";

export interface Config {
  api: {
    baseUrl: string;
  };
}

export const parseConfig = (
  envVars: Record<string, string | undefined>,
): Config => {
  const envSchema = z.object({
    REACT_APP_API_BASE_URL: z.string().url(),
  });

  const env = envSchema.parse(envVars);

  return {
    api: { baseUrl: env.REACT_APP_API_BASE_URL },
  };
};

export const ConfigContext = createContext<Config | null>(
  null,
);
```

