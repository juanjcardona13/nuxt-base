import type { ValidationProvider } from "~/services/validation/interfaces/ValidationProvider";
import { NullValidationProvider } from "~/services/validation/providers/NullValidationProvider";

type ValidationMethod = (...args: unknown[]) => boolean | string;

export class ValidationService<T extends string = string> {
  private readonly providerMap: Map<T, ValidationProvider> = new Map();
  private defaultProvider: T | null = null;
  public readonly all: ValidationProvider;
  public readonly providers: Record<T, ValidationProvider>;
  private readonly nullProvider: ValidationProvider;

  constructor() {
    this.nullProvider = new NullValidationProvider();

    this.all = new Proxy({} as ValidationProvider, {
      get: (_, prop: string) => {
        return (...args: unknown[]) => {
          if (this.providerMap.size === 0) {
            const method = this.nullProvider[
              prop as keyof ValidationProvider
            ] as ValidationMethod;
            return method.apply(this.nullProvider, args);
          }

          const results = Array.from(this.providerMap.values()).map(
            (provider) => {
              const method = provider[
                prop as keyof ValidationProvider
              ] as ValidationMethod;
              if (typeof method === "function") {
                return method.call(provider, ...args);
              }
              return true;
            }
          );

          const error = results.find((result) => typeof result === "string");
          if (error) return error;

          // Otherwise, return true only if all providers returned true
          return results.every((result) => result === true);
        };
      },
    });

    this.providers = new Proxy({} as Record<T, ValidationProvider>, {
      get: (_, prop: string) => {
        return this.providerMap.get(prop as T) || this.nullProvider;
      },
    });
  }

  addProvider(
    name: T,
    provider: ValidationProvider,
    isDefault: boolean = false
  ): void {
    if (!name || typeof name !== "string") {
      throw new Error("Provider name must be a non-empty string");
    }

    if (isDefault && this.defaultProvider && this.defaultProvider !== name) {
      throw new Error(
        "A default provider already exists. Remove it first or use setDefaultProvider instead."
      );
    }

    this.providerMap.set(name, provider);

    if (
      isDefault ||
      (this.defaultProvider === null && this.providerMap.size === 1)
    ) {
      this.defaultProvider = name;
    }
  }

  setDefaultProvider(name: T): void {
    if (!this.providerMap.has(name)) {
      throw new Error(`Provider '${name}' does not exist`);
    }
    this.defaultProvider = name;
  }

  getDefaultProvider(): ValidationProvider {
    if (!this.defaultProvider) {
      return this.nullProvider;
    }
    return this.providerMap.get(this.defaultProvider) || this.nullProvider;
  }

  validateField(
    schema: unknown,
    path: string,
    value: unknown
  ): boolean | string {
    return this.getDefaultProvider().validateField(schema, path, value);
  }

  validateObject(schema: unknown, object: unknown): boolean {
    return this.getDefaultProvider().validateObject(schema, object);
  }
}
