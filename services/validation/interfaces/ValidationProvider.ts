export interface ValidationProvider {
  getSchemaShape(schema: unknown): Record<string, unknown>;

  validateField(
    schema: unknown,
    path: string,
    value: unknown
  ): boolean | string;

  validateObject(schema: unknown, object: unknown): boolean;
}
