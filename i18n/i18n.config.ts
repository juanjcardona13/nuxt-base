import { en as $enVuetify, nl as $nlVuetify } from "vuetify/locale";
import en from "./locales/en.json";
import nl from "./locales/nl.json";

export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: "en",
    messages: {
      en: {
        ...en,
        bye: "Bye",
        $vuetify: $enVuetify,
      },
      nl: {
        ...nl,
        bye: "Doei",
        $vuetify: $nlVuetify,
      },
    },
  };
});
