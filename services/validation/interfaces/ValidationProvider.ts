export interface ValidationProvider {
  validateField(
    schema: unknown,
    path: string,
    value: unknown
  ): boolean | string;

  validateObject(schema: unknown, object: unknown): boolean;
}
