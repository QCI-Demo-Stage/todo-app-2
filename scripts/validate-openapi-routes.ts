/**
 * Ensures Express task routes and OpenAPI path items stay aligned.
 * Run: npx ts-node scripts/validate-openapi-routes.ts
 */
import * as fs from "fs";
import * as path from "path";
import * as YAML from "yamljs";

const root = path.resolve(__dirname, "..");
const openapiPath = path.join(root, "src/docs/openapi.yaml");
const tasksRoutePath = path.join(root, "src/routes/tasks.ts");

interface RouteDef {
  method: string;
  pathPattern: string;
}

function extractExpressRoutes(source: string): RouteDef[] {
  const routes: RouteDef[] = [];
  const re = /router\.(get|post|put|delete|patch)\(\s*["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    routes.push({ method: m[1].toUpperCase(), pathPattern: m[2] });
  }
  return routes;
}

function mountPathToOpenApi(mount: string, expressPath: string): string {
  const base = mount.endsWith("/") ? mount.slice(0, -1) : mount;
  const p = expressPath === "/" ? "" : expressPath;
  return `${base}${p}`.replace(/\/:([a-zA-Z]+)/g, "/{$1}");
}

function extractOpenApiPaths(spec: Record<string, unknown>): Map<string, Set<string>> {
  const paths = spec.paths as Record<string, Record<string, unknown>> | undefined;
  if (!paths) {
    throw new Error("OpenAPI document has no paths");
  }
  const map = new Map<string, Set<string>>();
  for (const [p, item] of Object.entries(paths)) {
    const methods = new Set<string>();
    for (const key of Object.keys(item)) {
      if (["get", "post", "put", "delete", "patch", "options", "head"].includes(key)) {
        methods.add(key.toUpperCase());
      }
    }
    map.set(p, methods);
  }
  return map;
}

function main(): void {
  const tasksSource = fs.readFileSync(tasksRoutePath, "utf8");
  const expressRoutes = extractExpressRoutes(tasksSource);
  const mount = "/tasks";
  const implemented = expressRoutes.map((r) => ({
    method: r.method,
    openApiPath: mountPathToOpenApi(mount, r.pathPattern),
  }));

  const spec = YAML.load(openapiPath) as Record<string, unknown>;
  const openApiMap = extractOpenApiPaths(spec);

  const errors: string[] = [];

  for (const { method, openApiPath } of implemented) {
    const methods = openApiMap.get(openApiPath);
    if (!methods) {
      errors.push(`OpenAPI missing path: ${openApiPath} (needed for ${method} from Express)`);
      continue;
    }
    if (!methods.has(method)) {
      errors.push(`OpenAPI path ${openApiPath} missing method ${method}`);
    }
  }

  const implementedKeys = new Set(implemented.map((x) => `${x.method} ${x.openApiPath}`));
  for (const [openApiPath, methods] of openApiMap.entries()) {
    if (!openApiPath.startsWith("/tasks")) {
      continue;
    }
    for (const m of methods) {
      const key = `${m} ${openApiPath}`;
      if (!implementedKeys.has(key)) {
        errors.push(
          `OpenAPI defines ${m} ${openApiPath} but no matching Express route in tasks.ts`
        );
      }
    }
  }

  if (errors.length > 0) {
    console.error("OpenAPI / Express route mismatch:\n" + errors.map((e) => `  - ${e}`).join("\n"));
    process.exit(1);
  }
  console.log(
    `OK: ${implemented.length} Express task route(s) match OpenAPI paths under /tasks.`
  );
}

main();
