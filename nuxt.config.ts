// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  ssr: false,
  devtools: { enabled: true },
  typescript: {
    typeCheck: true,
  },
  css: ["@/assets/css/globals.scss"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@vueuse/nuxt",
    "vuetify-nuxt-module",
    "@nuxtjs/i18n",
    "@nuxtjs/google-fonts",
  ],
  vuetify: {
    moduleOptions: {
      disableVuetifyStyles: true,
      styles: {
        configFile: "./assets/css/components.scss",
      },
    },
  },
  i18n: {
    defaultLocale: "en",
    locales: [
      {
        code: "en",
        name: "English",
      },
      {
        code: "nl",
        name: "Nederlands",
      },
    ],
  },
  fonts: {
    /**
     * Review periodically
     * https://github.com/nuxt/fonts/issues/57
     */
  },
  googleFonts: {
    families: {
      Roboto: [400, 700],
    },
  },
  runtimeConfig: {
    public: {
      mixpanelToken: "", //45b8ae293a1ecb136eafa2927e95ecd3
      posthogPublicKey: "", //phc_P3zBtM9TOGjECyzlhR0UUUs3lvyAUhiYkrcURMopnCg
      posthogHost: "https://us.i.posthog.com",
    },
  },
});
