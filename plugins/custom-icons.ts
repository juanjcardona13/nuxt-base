import { h } from "vue";
import { Icon } from "#components";
import type { IconSet, IconProps, IconAliases } from "vuetify";

const nuxtIcon: IconSet = {
  component: (props: IconProps) => {
    const { tag, icon, mode, ...rest } = props as IconProps & { mode: string };
    return h(tag, rest, [h(Icon, { name: icon, mode })]);
  },
};

export const aliases = <IconAliases>{
  email: "i-mdi:calendar",
  collapse: "i-mdi:chevron-up",
  complete: "i-mdi:check",
  cancel: "i-mdi:close-circle",
  close: "i-mdi:close",
  delete: "i-mdi:close-circle",
  // delete (e.g. v-chip close)
  clear: "i-mdi:close-circle",
  success: "i-mdi:check-circle",
  info: "i-mdi:information",
  warning: "i-mdi:alert-circle",
  error: "i-mdi:close-circle",
  prev: "i-mdi:chevron-left",
  next: "i-mdi:chevron-right",
  checkboxOn: "i-mdi:checkbox-marked",
  checkboxOff: "i-mdi:checkbox-blank-outline",
  checkboxIndeterminate: "i-mdi:minus-box",
  delimiter: "i-mdi:circle",
  // for carousel
  sortAsc: "i-mdi:arrow-up",
  sortDesc: "i-mdi:arrow-down",
  expand: "i-mdi:chevron-down",
  menu: "i-mdi:menu",
  subgroup: "i-mdi:menu-down",
  dropdown: "i-mdi:menu-down",
  radioOn: "i-mdi:radiobox-marked",
  radioOff: "i-mdi:radiobox-blank",
  edit: "i-mdi:pencil",
  ratingEmpty: "i-mdi:star-outline",
  ratingFull: "i-mdi:star",
  ratingHalf: "i-mdi:star-half-full",
  loading: "i-mdi:cached",
  first: "i-mdi:page-first",
  last: "i-mdi:page-last",
  unfold: "i-mdi:unfold-more-horizontal",
  file: "i-mdi:paperclip",
  plus: "i-mdi:plus",
  minus: "i-mdi:minus",
  calendar: "i-mdi:calendar",
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vuetify:before-create", ({ vuetifyOptions }) => {
    vuetifyOptions.icons = {
      defaultSet: "nuxt",
      sets: {
        nuxt: nuxtIcon,
      },
      aliases,
    };
  });
});
