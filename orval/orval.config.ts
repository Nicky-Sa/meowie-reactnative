const config = {
  api: {
    input: `http://localhost:5005/docs-json`, // Default NestJS Swagger path
    output: {
      target: "./generated/endpoints.ts", // Where hooks go
      schemas: "./generated/model", // Where interfaces go
      prettier: true,
      override: {
        mutator: {
          path: "./axios-instance.ts",
          name: "customInstance",
        },
      },
    },
  },
};

export default config;
