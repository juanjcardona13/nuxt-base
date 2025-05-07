import type { ValidationProvider } from "~/services/validation/interfaces/ValidationProvider";

export class NullValidationProvider implements ValidationProvider {
  private readonly name: string;

  constructor(name: string = "null") {
    this.name = name;
  }

  validateField(
    _schema: unknown,
    path: string,
    _value: unknown
  ): boolean | string {
    console.warn(
      `[Validation] Attempted to validate field '${path}' but no provider is configured`
    );
    return true;
  }

  validateObject(_schema: unknown, _object: unknown): boolean {
    console.warn(
      `[Validation] Attempted to validate object but no provider is configured`
    );
    return true;
  }
}
