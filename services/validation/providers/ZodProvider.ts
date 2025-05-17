import type { z } from "zod";
import type { ValidationProvider } from "~/services/validation/interfaces/ValidationProvider";

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
