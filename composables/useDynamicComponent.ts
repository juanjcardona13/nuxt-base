import * as components from "vuetify/components";

export function useDynamicComponent(component: keyof typeof components) {
  let name = component;
  if (!isPascalCase(component)) {
    name = transformString(component, "PascalCase") as keyof typeof components;
  }
  return components[name];
}
