export type CaseType =
  | "camelCase"
  | "PascalCase"
  | "snake_case"
  | "kebab-case"
  | "lowercase"
  | "UPPERCASE";

export type ValidatorFn = (_value: unknown) => boolean | string;

export type Rules<T> = {
  [K in keyof T]: T[K] extends object ? Rules<T[K]> : ValidatorFn[];
};

function splitWords(str: string): string[] {
  const separators = ["-", "_", " ", ".", ":"];
  for (const sep of separators) {
    if (str.includes(sep)) {
      return str
        .split(sep)
        .filter(Boolean)
        .map((w) => w.toLowerCase());
    }
  }

  const withSpaces = str.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return withSpaces
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
}

const caseFunctions: Record<CaseType, (words: string[]) => string> = {
  camelCase(words) {
    return (
      words[0] +
      words
        .slice(1)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("")
    );
  },
  PascalCase(words) {
    return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
  },
  snake_case(words) {
    return words.join("_");
  },
  "kebab-case": function (words) {
    return words.join("-");
  },
  lowercase(words) {
    return words.join("");
  },
  UPPERCASE(words) {
    return words.join("").toUpperCase();
  },
};

export function transformString(str: string, type: CaseType): string {
  const words = splitWords(str);
  const fn = caseFunctions[type];
  if (!fn) {
    throw new Error(`Case type "${type}" no soportado.`);
  }
  return fn(words);
}

export function isCamelCase(str: string): boolean {
  return /^[a-z]+(?:[A-Z][a-z0-9]*)*$/.test(str);
}

export function isPascalCase(str: string): boolean {
  return /^[A-Z]+(?:[A-Z][a-z0-9]*)*$/.test(str);
}

export function isSnakeCase(str: string): boolean {
  return /^[a-z0-9]+(?:_[a-z0-9]*)*$/.test(str);
}

/**
 * Build Vuetify rules for a schema
 * TODO: This yet is a MVP, need to improve it to support more complex schemas, array, cycle, etc
 * @param schema  — Schema of Zod, Yup, Joi…
 * @param model   — ref to the data object
 * @param fnValidation — validation function
 * @param basePath— property prefix (for nested: "pet.name")
 */
export function buildRules<T extends object>(
  schema: unknown,
  model: Ref<T>,
  fnGetShape: (schema: unknown) => Record<string, unknown>,
  fnValidation: (
    schema: unknown,
    path: string,
    value: unknown
  ) => string | boolean,
  basePath = "",
  shape?: Record<string, unknown>
): Rules<T> {
  const result = {} as Rules<T>;
  const currentShape = shape || fnGetShape(schema); // Example of result: { "name": "string", "select": "string", "checkbox": "boolean", "pet": { "name": "string", "age": "number" } }
  for (const key in currentShape) {
    const fullPath = basePath ? `${basePath}.${key}` : key;
    const fieldShape = currentShape[key];

    if (
      fieldShape !== null &&
      typeof fieldShape === "object" &&
      !Array.isArray(fieldShape)
    ) {
      (result as Record<string, unknown>)[key] = buildRules(
        schema,
        model,
        fnGetShape,
        fnValidation,
        fullPath,
        fieldShape as Record<string, unknown>
      );
    } else {
      (result as Record<string, unknown>)[key] = [
        (_value: unknown) => fnValidation(schema, fullPath, model.value),
      ];
    }
  }
  return result;
}
