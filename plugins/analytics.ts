import { AnalyticsService } from "~/services/analytics/AnalyticsService";
import { MixpanelProvider } from "~/services/analytics/providers/MixpanelProvider";
import { PostHogProvider } from "~/services/analytics/providers/PostHogProvider";

type AnalyticsProviders = "posthog" | "mixpanel";

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  const analyticsService = new AnalyticsService<AnalyticsProviders>();

  if (runtimeConfig.public.posthogPublicKey) {
    analyticsService.addProvider(
      "posthog",
      new PostHogProvider(
        runtimeConfig.public.posthogPublicKey,
        runtimeConfig.public.posthogHost
      ),
      true
    );
  }

  if (runtimeConfig.public.mixpanelToken) {
    analyticsService.addProvider(
      "mixpanel",
      new MixpanelProvider(runtimeConfig.public.mixpanelToken)
    );
  }

  return {
    provide: {
      analytics: analyticsService,
    },
  };
});
