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
      const result = schema.validateSyncAt(path, value);
      console.log("validateField result from yup", result);
      return true;
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        return error.message;
      }
      throw error;
    }
  }

  validateObject(schema: yup.AnySchema, object: unknown): boolean {
    console.log("validateObject from yup", schema, object);
    if (!schema) {
      throw new Error("Schema is required");
    }
    const result = schema.validate(object);
    console.log("validateObject result from yup", result);
    return true;
  }
}
