import * as yup from "yup";

import type { ValidationProvider } from "~/services/validation/interfaces/ValidationProvider";

export class YupProvider implements ValidationProvider {
  validateField(
    schema: yup.AnySchema,
    path: string,
    value: unknown
  ): boolean | string {
    if (!schema || !path) {
      throw new Error("Schema and path are required");
    }

    try {
      schema.validateSyncAt(path, value);
      return true;
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        return error.message;
      }
      throw error;
    }
  }

  validateObject(schema: yup.AnySchema, object: unknown): boolean {
    if (!schema) {
      throw new Error("Schema is required");
    }
    schema.validate(object);
    return true;
  }
}
