import { useTheme } from "vuetify";

type ThemeMode = "dark" | "light" | "auto";
type IconMap = Record<ThemeMode, string>;

export function useThemeToggle(customIcons: Partial<IconMap> = {}) {
  const vuetifyTheme = useTheme();
  const { system, store } = useColorMode<ThemeMode>({ emitAuto: true });

  const { state, next } = useCycleList<ThemeMode>(["dark", "light", "auto"], {
    initialValue: store,
  });

  watchEffect(() => {
    store.value = state.value;
    vuetifyTheme.global.name.value =
      store.value === "auto" ? system.value : store.value;
  });

  const defaultIcons: IconMap = {
    light: "solar:sun-2-line-duotone",
    dark: "solar:moon-line-duotone",
    auto: "solar:sun-fog-line-duotone",
  };
  const icons: IconMap = { ...defaultIcons, ...customIcons };

  const icon = computed(() => icons[state.value]);

  return { mode: state, icon, next, system };
}
