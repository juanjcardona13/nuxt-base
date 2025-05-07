import type { AnalyticsProvider } from "~/services/analytics/interfaces/AnalyticsProvider";

export class NullAnalyticsProvider implements AnalyticsProvider {
  private readonly name: string;

  constructor(name: string = "null") {
    this.name = name;
  }

  capture(eventName: string, _properties?: Record<string, unknown>): void {
    console.warn(
      `[Analytics] Attempted to capture event '${eventName}' but no provider is configured`
    );
  }

  identify(distinctId: string, _properties?: Record<string, unknown>): void {
    console.warn(
      `[Analytics] Attempted to identify user '${distinctId}' but no provider is configured`
    );
  }

  reset(): void {
    console.warn(
      "[Analytics] Attempted to reset but no provider is configured"
    );
  }

  trackPageView(url?: string): void {
    console.warn(
      `[Analytics] Attempted to track page view '${url}' but no provider is configured`
    );
  }
}
