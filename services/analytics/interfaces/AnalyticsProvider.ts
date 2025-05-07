export interface AnalyticsProvider {
  reset(): void;
  trackPageView(url?: string): void;
  capture(eventName: string, properties?: Record<string, unknown>): void;
  identify(distinctId: string, properties?: Record<string, unknown>): void;
}
