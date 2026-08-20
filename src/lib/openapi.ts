/**
 * Helpers for the /docs/api/ page.
 *
 * The page renders `src/data/openapi.json`, which `scripts/sync-openapi.mjs`
 * copies out of the Lector repository. Nothing here fetches at run time: the
 * whole page is static HTML.
 */

export interface OpenApiSchema {
  $ref?: string;
  type?: string | string[];
  format?: string;
  enum?: unknown[];
  description?: string;
  properties?: Record<string, OpenApiSchema>;
  required?: string[];
  items?: OpenApiSchema;
  oneOf?: OpenApiSchema[];
  additionalProperties?: OpenApiSchema | boolean;
  propertyNames?: OpenApiSchema;
  minItems?: number;
  minimum?: number;
  maximum?: number;
  examples?: unknown[];
}

export interface OpenApiParameter {
  $ref?: string;
  name?: string;
  in?: "path" | "query" | "header" | "cookie";
  required?: boolean;
  description?: string;
  schema?: OpenApiSchema;
}

export interface OpenApiBody {
  required?: boolean;
  description?: string;
  content?: Record<string, { schema?: OpenApiSchema }>;
}

export interface OpenApiResponse {
  description?: string;
  content?: Record<string, { schema?: OpenApiSchema }>;
}

export interface OpenApiOperation {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  deprecated?: boolean;
  parameters?: OpenApiParameter[];
  requestBody?: OpenApiBody;
  responses?: Record<string, OpenApiResponse>;
  security?: unknown[];
  "x-token-scope"?: string;
}

export interface OpenApiDocument {
  openapi: string;
  info: { title: string; version: string; description?: string };
  servers?: { url: string; description?: string }[];
  tags?: { name: string; description?: string }[];
  paths: Record<string, Record<string, OpenApiOperation>>;
  components?: {
    schemas?: Record<string, OpenApiSchema>;
    parameters?: Record<string, OpenApiParameter>;
  };
}

export interface Endpoint {
  method: string;
  path: string;
  operation: OpenApiOperation;
  /** Anchor id, e.g. `get-api-vocab-by-id`. */
  id: string;
}

export interface Section {
  name: string;
  description?: string;
  /** Anchor id for the tag heading. */
  id: string;
  endpoints: Endpoint[];
}

const METHOD_ORDER = ["get", "post", "put", "patch", "delete", "head"];

export function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[{}]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Endpoints grouped by tag, in the tag order the document declares. */
export function sections(doc: OpenApiDocument): Section[] {
  const byTag = new Map<string, Endpoint[]>();

  for (const [path, methods] of Object.entries(doc.paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      const tag = operation.tags?.[0] ?? "Other";
      const endpoint: Endpoint = {
        method: method.toUpperCase(),
        path,
        operation,
        id: slug(`${method}-${path}`),
      };
      const list = byTag.get(tag);
      if (list) list.push(endpoint);
      else byTag.set(tag, [endpoint]);
    }
  }

  for (const list of byTag.values()) {
    list.sort((a, b) => {
      if (a.path !== b.path) return a.path.localeCompare(b.path);
      return (
        METHOD_ORDER.indexOf(a.method.toLowerCase()) -
        METHOD_ORDER.indexOf(b.method.toLowerCase())
      );
    });
  }

  const declared = (doc.tags ?? []).map((tag) => tag.name);
  const names = [...byTag.keys()].sort((a, b) => {
    const left = declared.indexOf(a);
    const right = declared.indexOf(b);
    if (left === -1 && right === -1) return a.localeCompare(b);
    if (left === -1) return 1;
    if (right === -1) return -1;
    return left - right;
  });

  return names.map((name) => ({
    name,
    id: slug(name),
    description: (doc.tags ?? []).find((tag) => tag.name === name)?.description,
    endpoints: byTag.get(name) ?? [],
  }));
}

/** Follows a local `$ref`. Returns the value itself when it holds no `$ref`. */
export function resolve<T extends { $ref?: string }>(
  value: T,
  doc: OpenApiDocument,
): T {
  if (!value.$ref) return value;
  const [, , section, name] = value.$ref.split("/");
  const table = (
    doc.components as Record<string, Record<string, T>> | undefined
  )?.[section];
  return table?.[name] ?? value;
}

/** The component name a `$ref` points at, e.g. `VocabEntry`. */
export function refName(schema: OpenApiSchema | undefined): string | undefined {
  if (!schema?.$ref) return undefined;
  return schema.$ref.split("/").pop();
}

/** A short type label, e.g. `string`, `integer or null`, `VocabEntry[]`. */
export function typeLabel(
  schema: OpenApiSchema | undefined,
  doc: OpenApiDocument,
): string {
  if (!schema) return "any";

  const named = refName(schema);
  if (named) return named;

  if (schema.oneOf) {
    return schema.oneOf.map((branch) => typeLabel(branch, doc)).join(" or ");
  }

  const types = Array.isArray(schema.type)
    ? schema.type
    : schema.type
      ? [schema.type]
      : [];

  if (types.includes("array")) {
    const item = typeLabel(schema.items, doc);
    const rest = types.filter((type) => type !== "array");
    const label = `${item}[]`;
    return rest.length > 0 ? [label, ...rest].join(" or ") : label;
  }

  if (types.length === 0) return schema.properties ? "object" : "any";
  if (types.length === 1 && schema.format)
    return `${types[0]} (${schema.format})`;
  return types.join(" or ");
}

export interface FieldRow {
  depth: number;
  /** Property name, `[]` for an array item, or `<key>` for a free-form key. */
  name: string;
  type: string;
  required: boolean;
  description?: string;
  enumValues?: string[];
}

const MAX_DEPTH = 3;

function pushFields(
  schema: OpenApiSchema | undefined,
  doc: OpenApiDocument,
  depth: number,
  seen: Set<string>,
  rows: FieldRow[],
): void {
  if (!schema || depth > MAX_DEPTH) return;

  const named = refName(schema);
  if (named) {
    if (seen.has(named)) return;
    seen = new Set(seen).add(named);
  }
  const target = resolve(schema, doc);

  if (target.oneOf) {
    // A `oneOf` of a value and an array of that same value flattens to the
    // same fields twice. Emit each distinct field list once.
    const emitted = new Set<string>();
    for (const branch of target.oneOf) {
      const branchRows: FieldRow[] = [];
      pushFields(branch, doc, depth, seen, branchRows);
      const key = JSON.stringify(branchRows);
      if (emitted.has(key)) continue;
      emitted.add(key);
      rows.push(...branchRows);
    }
    return;
  }

  const types = Array.isArray(target.type)
    ? target.type
    : target.type
      ? [target.type]
      : [];

  if (types.includes("array")) {
    pushFields(target.items, doc, depth, seen, rows);
    return;
  }

  if (target.properties) {
    const required = new Set(target.required ?? []);
    for (const [name, property] of Object.entries(target.properties)) {
      const resolved = resolve(property, doc);
      rows.push({
        depth,
        name,
        type: typeLabel(property, doc),
        required: required.has(name),
        description: property.description ?? resolved.description,
        enumValues: (resolved.enum ?? property.enum)?.map((value) =>
          JSON.stringify(value),
        ),
      });
      pushFields(property, doc, depth + 1, seen, rows);
    }
    return;
  }

  const extra = target.additionalProperties;
  if (extra && typeof extra === "object") {
    rows.push({
      depth,
      name: "<key>",
      type: typeLabel(extra, doc),
      required: false,
      // The parent's own description renders above this list, so a free-form
      // key must not repeat it.
      description: extra.description,
      enumValues: resolve(extra, doc).enum?.map((value) =>
        JSON.stringify(value),
      ),
    });
    pushFields(extra, doc, depth + 1, seen, rows);
  }
}

/**
 * A flat, indented field list for one schema. Object properties nest, an array
 * is described by the fields of its item, and a `$ref` cycle stops the walk.
 */
export function fields(
  schema: OpenApiSchema | undefined,
  doc: OpenApiDocument,
): FieldRow[] {
  const rows: FieldRow[] = [];
  pushFields(schema, doc, 0, new Set(), rows);
  return rows;
}

/** The JSON schema of a request body or a response, if it carries one. */
export function jsonSchema(
  holder: { content?: Record<string, { schema?: OpenApiSchema }> } | undefined,
): OpenApiSchema | undefined {
  const content = holder?.content;
  if (!content) return undefined;
  return (content["application/json"] ?? Object.values(content)[0])?.schema;
}

/** The single content type a body or response uses, e.g. `multipart/form-data`. */
export function contentType(
  holder: { content?: Record<string, { schema?: OpenApiSchema }> } | undefined,
): string | undefined {
  const keys = Object.keys(holder?.content ?? {});
  return keys.length > 0 ? keys[0] : undefined;
}

/** Parameters of one kind, with every `$ref` resolved. */
export function params(
  operation: OpenApiOperation,
  doc: OpenApiDocument,
  kind: "path" | "query",
): OpenApiParameter[] {
  return (operation.parameters ?? [])
    .map((param) => resolve(param, doc))
    .filter((param) => param.in === kind);
}

/** Success responses, ordered by status. */
export function successes(
  operation: OpenApiOperation,
): [string, OpenApiResponse][] {
  return Object.entries(operation.responses ?? {})
    .filter(([status]) => status.startsWith("2"))
    .sort(([a], [b]) => a.localeCompare(b));
}

/**
 * Error responses worth listing per endpoint. The shared 401, 403, 429 and 500
 * are described once on the page, so they stay out of every endpoint.
 */
export function errors(
  operation: OpenApiOperation,
): [string, OpenApiResponse][] {
  const shared = new Set(["401", "403", "429", "500"]);
  return Object.entries(operation.responses ?? {})
    .filter(([status]) => !status.startsWith("2") && !shared.has(status))
    .sort(([a], [b]) => a.localeCompare(b));
}

/** A copy-and-run curl example for the endpoint. */
export function curl(
  endpoint: Endpoint,
  doc: OpenApiDocument,
  server: string,
): string {
  const { method, path, operation } = endpoint;
  const query = params(operation, doc, "query")
    .filter((param) => param.required)
    .map((param) => `${param.name}=VALUE`)
    .join("&");
  const url = `${server}${path}${query ? `?${query}` : ""}`;
  // An operation with an empty `security` array needs no credential.
  const open =
    Array.isArray(operation.security) && operation.security.length === 0;
  const head = `curl${method === "GET" ? "" : ` -X ${method}`} '${url}'`;
  if (open) return head;
  const lines = [`${head} \\`];
  lines.push(`  -H 'Authorization: Bearer $LECTOR_TOKEN'`);
  if (operation.requestBody) {
    const type = contentType(operation.requestBody) ?? "application/json";
    if (type === "application/json") {
      lines[lines.length - 1] += " \\";
      lines.push(`  -H 'Content-Type: application/json' \\`);
      lines.push(`  -d '{ ... }'`);
    } else {
      lines[lines.length - 1] += " \\";
      lines.push(`  -F 'file=@example'`);
    }
  }
  return lines.join("\n");
}

export interface InlinePart {
  code: boolean;
  text: string;
}

/**
 * Splits prose on backtick code spans, so a description renders as text and
 * `<code>` without any raw HTML. The generated document is Markdown-flavoured
 * text, and a code span is the only markup it uses inline.
 */
export function inlineParts(text: string): InlinePart[] {
  return text
    .split("`")
    .map((part, index) => ({ code: index % 2 === 1, text: part }))
    .filter((part) => part.text.length > 0);
}
