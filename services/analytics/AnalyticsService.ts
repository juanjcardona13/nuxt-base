import type { AnalyticsProvider } from "~/services/analytics/interfaces/AnalyticsProvider";
import { NullAnalyticsProvider } from "~/services/analytics/providers/NullAnalyticsProvider";

type AnalyticsMethod = (...args: unknown[]) => void;

export class AnalyticsService<T extends string = string> {
  private readonly providerMap: Map<T, AnalyticsProvider> = new Map();
  private defaultProvider: T | null = null;
  public readonly all: AnalyticsProvider;
  public readonly providers: Record<T, AnalyticsProvider>;
  private readonly nullProvider: AnalyticsProvider;

  constructor() {
    this.nullProvider = new NullAnalyticsProvider();

    this.all = new Proxy({} as AnalyticsProvider, {
      get: (_, prop: string) => {
        return (...args: unknown[]) => {
          if (this.providerMap.size === 0) {
            const method = this.nullProvider[
              prop as keyof AnalyticsProvider
            ] as AnalyticsMethod;
            method.apply(this.nullProvider, args);
            return;
          }
          Array.from(this.providerMap.values()).forEach((provider) => {
            const method = provider[
              prop as keyof AnalyticsProvider
            ] as AnalyticsMethod;
            if (typeof method === "function") {
              method.call(provider, ...args);
            }
          });
        };
      },
    });

    this.providers = new Proxy({} as Record<T, AnalyticsProvider>, {
      get: (_, prop: string) => {
        return this.providerMap.get(prop as T) || this.nullProvider;
      },
    });
  }

  addProvider(
    name: T,
    provider: AnalyticsProvider,
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

  getDefaultProvider(): AnalyticsProvider {
    if (!this.defaultProvider) {
      return this.nullProvider;
    }
    return this.providerMap.get(this.defaultProvider) || this.nullProvider;
  }

  capture(eventName: string, properties?: Record<string, unknown>): void {
    this.getDefaultProvider().capture(eventName, properties);
  }

  identify(distinctId: string, properties?: Record<string, unknown>): void {
    this.getDefaultProvider().identify(distinctId, properties);
  }

  reset(): void {
    this.getDefaultProvider().reset();
  }

  trackPageView(url?: string): void {
    this.getDefaultProvider().trackPageView(url);
  }
}
