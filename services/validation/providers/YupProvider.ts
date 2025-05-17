import * as yup from "yup";

import type { ValidationProvider } from "~/services/validation/interfaces/ValidationProvider";

interface Shape {
  [key: string]: string | Shape;
}

function getShapeFromDescription(
  desc: yup.SchemaFieldDescription | yup.SchemaObjectDescription
): Shape {
  const result: Shape = {};
  if (!("fields" in desc)) return result;
  if (!desc.fields) return result;

  for (const [key, fieldDesc] of Object.entries(desc.fields)) {
    if (fieldDesc.type === "object" && "fields" in fieldDesc) {
      result[key] = getShapeFromDescription(fieldDesc);
    } else {
      result[key] = fieldDesc.type;
    }
  }

  return result;
}

export class YupProvider implements ValidationProvider {
  getSchemaShape(schema: yup.AnySchema): Record<string, unknown> {
    return getShapeFromDescription(schema.describe());
  }

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
