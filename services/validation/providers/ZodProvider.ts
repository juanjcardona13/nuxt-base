import type { z } from "zod";
import type { ValidationProvider } from "~/services/validation/interfaces/ValidationProvider";
import { zodToJsonSchema, type JsonSchema7Type } from "zod-to-json-schema";

interface Shape {
  [key: string]: string | Shape;
}

function jsonSchemaToShape(jsonSchema: JsonSchema7Type): Shape {
  const props = "properties" in jsonSchema ? jsonSchema.properties : {};
  const result: Shape = {};

  for (const [key, propSchema] of Object.entries(props) as [
    string,
    JsonSchema7Type,
  ][]) {
    if (
      "type" in propSchema &&
      propSchema.type === "object" &&
      "properties" in propSchema
    ) {
      result[key] = jsonSchemaToShape(propSchema);
    } else {
      const t = "type" in propSchema ? propSchema.type : undefined;
      if (Array.isArray(t)) {
        result[key] = t.find((x) => x !== "null") as string;
      } else {
        result[key] = t ?? "unknown";
      }
    }
  }

  return result;
}

const zodValidationRule = (
  schema: z.ZodTypeAny,
  path: string,
  value: unknown
): boolean | string => {
  const response = schema.safeParse(value);

  if (!response.success) {
    const issue = response.error.issues.find((issue) => {
      return issue.path.join(".") === path;
    });
    if (issue) {
      return issue.message;
    }
  }
  return true;
};

export class ZodProvider implements ValidationProvider {
  getSchemaShape(schema: z.ZodTypeAny): Record<string, unknown> {
    const jsonSchema = zodToJsonSchema(schema);
    return jsonSchemaToShape(jsonSchema);
  }

  validateField(
    schema: z.ZodTypeAny,
    path: string,
    value: unknown
  ): boolean | string {
    if (!schema || !path) {
      throw new Error("Schema and path are required");
    }
    return zodValidationRule(schema, path, value);
  }

  validateObject(schema: z.ZodTypeAny, object: unknown): boolean {
    if (!schema) {
      throw new Error("Schema is required");
    }
    schema.parse(object);
    return true;
  }
}
