import path from "path";
import YAML from "yamljs";

export const swaggerDocument = YAML.load(
  path.resolve(process.cwd(), "src/docs/openapi.yaml"),
);
