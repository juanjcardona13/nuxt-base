import type { z } from "zod";
import type { ValidationProvider } from "~/services/validation/interfaces/ValidationProvider";

const zodValidationRule = (
  schema: z.ZodTypeAny,
  path: string,
  value: unknown
): boolean | string => {
  const response = schema.safeParse(value);
  if (!response.success) {
    const issue = response.error.issues.find(
      (issue) => issue.path.join(".") === path
    );
    if (issue) {
      return issue.message;
    }
  }
  return true;
};

export class ZodProvider implements ValidationProvider {
  validateField(
    schema: z.ZodTypeAny,
    path: string,
    value: unknown
  ): boolean | string {
    if (!schema || !path) {
      throw new Error("Schema and path are required");
    }
    const result = zodValidationRule(schema, path, value);
    console.log("validateField result from zod", result);
    return result;
  }

  validateObject(schema: z.ZodTypeAny, object: unknown): boolean {
    console.log("validateObject from zod", schema, object);
    if (!schema) {
      throw new Error("Schema is required");
    }
    const result = schema.parse(object);
    console.log("validateObject result from zod", result);
    return true;
  }
}
