<script setup lang="ts">
import { z } from "zod";

// #region Theme
const { icon, next } = useThemeToggle();
// #endregion

// #region I18n
const { setLocale, locale, availableLocales } = useI18n();
// #endregion

// #region Analytics
const { $analytics } = useNuxtApp();
$analytics.capture("test", { test: "test" });
// #endregion

// #region Model Data
const items = ["Item 1", "Item 2", "Item 3", "Item 4"] as const;

const modelObject = ref<{
  name: string;
  select: (typeof items)[number];
  checkbox: boolean;
  pet: {
    name: string;
    age: number;
  };
}>({
  name: "",
  select: "Item 1",
  checkbox: false,
  pet: {
    name: "",
    age: 0,
  },
});

// #endregion

// #region Validation
const { $validation } = useNuxtApp();
const zodSchema = z.object({
  name: z.string().nonempty().max(10),
  select: z.enum(items).refine((v) => items.includes(v)),
  checkbox: z.boolean().refine((v) => v),
  pet: z.object({
    name: z.string().nonempty().max(10),
    age: z.number().min(0).max(5),
  }),
});

const zodRules = buildRules(
  zodSchema,
  modelObject,
  $validation.getSchemaShape,
  $validation.validateField
);
// #endregion

// #region Model Config
const modelConfig = {
  name: {
    id: "name",
    label: "My Name",
    hint: "Here is my name",
    placeholder: "Enter your name",
    is: useDynamicComponent("VTextField"),
    rules: zodRules.name,
  },
  select: {
    id: "select",
    label: "My Select",
    hint: "Here is my select",
    placeholder: "Select an item",
    is: useDynamicComponent("VSelect"),
    rules: zodRules.select,
    items,
    clearable: true,
  },
  checkbox: {
    id: "checkbox",
    label: "My Checkbox",
    hint: "Here is my checkbox",
    placeholder: "Select an item",
    is: useDynamicComponent("VCheckbox"),
    rules: zodRules.checkbox,
  },
  pet: {
    name: {
      id: "pet-name",
      label: "My Pet Name",
      hint: "Here is my pet name",
      placeholder: "Enter your pet name",
      is: useDynamicComponent("VTextField"),
      rules: zodRules.pet.name,
    },
    age: {
      id: "pet-age",
      label: "My Pet Age",
      hint: "Here is my pet age",
      placeholder: "Enter your pet age",
      is: useDynamicComponent("VTextField"),
      rules: zodRules.pet.age,
    },
  },
};
// #endregion
</script>

<template>
  <VApp>
    <!-- App Bar -->
    <VAppBar app>
      <!-- Title -->
      <VAppBarTitle>
        {{ $t("welcome") }}
      </VAppBarTitle>
      <VSpacer />
      <VBtn :icon="icon" @click="next()" />
      <!-- Locale -->
      <VMenu>
        <!-- Activator -->
        <template #activator="{ props }">
          <VBtn v-bind="props" :icon="`circle-flags:${locale}`" />
        </template>
        <!-- List Items -->
        <VList>
          <VListItem
            v-for="l in availableLocales"
            :key="l"
            :prepend-icon="`circle-flags:${l}`"
            :title="l.toUpperCase()"
            @click="setLocale(l)"
          />
        </VList>
      </VMenu>
    </VAppBar>
    <!-- Main -->
    <VMain class="mt-10">
      <VForm>
        <template #default="{ validate, reset, resetValidation, errors }">
          <VRow>
            <VCol cols="4">
              <VSheet class="mx-auto" width="300">
                <h4>Zod</h4>
                <component
                  :is="modelConfig.name.is"
                  v-bind="modelConfig.name"
                  v-model="modelObject.name"
                />
                <component
                  :is="modelConfig.select.is"
                  v-bind="modelConfig.select"
                  v-model="modelObject.select"
                />
                <component
                  :is="modelConfig.checkbox.is"
                  v-bind="modelConfig.checkbox"
                  v-model="modelObject.checkbox"
                />
                <component
                  :is="modelConfig.pet.name.is"
                  v-bind="modelConfig.pet.name"
                  v-model="modelObject.pet.name"
                />
                <component
                  :is="modelConfig.pet.age.is"
                  v-bind="modelConfig.pet.age"
                  v-model.number="modelObject.pet.age"
                />
              </VSheet>
            </VCol>
            <VCol cols="4">
              <pre>{{ modelObject }}</pre>
              <pre>{{ errors }}</pre>
            </VCol>
          </VRow>
          <VRow justify="center">
            <VCol cols="4">
              <div class="d-flex flex-column">
                <VBtn
                  class="mt-4"
                  color="success"
                  block
                  text="Validate"
                  @click="validate"
                />
                <VBtn
                  class="mt-4"
                  color="error"
                  block
                  text="Reset Form"
                  @click="reset"
                />
                <VBtn
                  class="mt-4"
                  color="warning"
                  block
                  text="Reset Validation"
                  @click="resetValidation"
                />
              </div>
            </VCol>
          </VRow>
        </template>
      </VForm>
    </VMain>
  </VApp>
</template>
