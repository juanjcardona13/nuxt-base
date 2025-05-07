<script setup lang="ts">
import * as yup from "yup";
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

// #region Validation
const { $validation } = useNuxtApp();
// #endregion

const form = ref();
const items = ["Item 1", "Item 2", "Item 3", "Item 4"] as const;
const modelObject = ref<{
  name: string;
  select: (typeof items)[number];
  checkbox: boolean;
}>({
  name: "test",
  select: "Item 1",
  checkbox: true,
});
const customRules = {
  nameRules: [
    (v: string) => !!v || "Name is required",
    (v: string) =>
      (v && v.length <= 10) || "Name must be 10 characters or less",
  ],
  selectRules: [
    (v: (typeof items)[number]) => !!v || "Item is required",
    (v: (typeof items)[number]) =>
      (v && items.includes(v)) || "Item must be one of the options",
  ],
  checkboxRules: [(v: boolean) => !!v || "You must agree to continue!"],
};
async function validate() {
  const { valid } = await form.value.validate();

  if (valid) alert("Form is valid");
}
function reset() {
  form.value.reset();
}
function resetValidation() {
  form.value.resetValidation();
}

const zodSchema = z.object({
  name: z.string().nonempty().max(10),
  select: z.enum(items).refine((v) => items.includes(v)),
  checkbox: z.boolean().refine((v) => v),
});
const yupSchema = yup.object({
  name: yup.string().required().max(10),
  select: yup.string().required().oneOf(items),
  checkbox: yup.boolean().oneOf([true]),
});

// gerRulesFromSchema

const zodRules = {
  nameRules: [
    (_value: string) =>
      $validation.validateField(zodSchema, "name", modelObject.value),
  ],
  selectRules: [
    (_value: (typeof items)[number]) =>
      $validation.validateField(zodSchema, "select", modelObject.value),
  ],
  checkboxRules: [
    (_value: boolean) =>
      $validation.validateField(zodSchema, "checkbox", modelObject.value),
  ],
};
const yupRules = {
  nameRules: [
    (_value: string) =>
      $validation.providers.yup.validateField(
        yupSchema,
        "name",
        modelObject.value
      ),
  ],
  selectRules: [
    (_value: (typeof items)[number]) =>
      $validation.providers.yup.validateField(
        yupSchema,
        "select",
        modelObject.value
      ),
  ],
  checkboxRules: [
    (_value: boolean) =>
      $validation.providers.yup.validateField(
        yupSchema,
        "checkbox",
        modelObject.value
      ),
  ],
};
</script>

<template>
  <VApp>
    <VAppBar app>
      <VAppBarTitle>
        {{ $t("welcome") }}
      </VAppBarTitle>
      <VSpacer />
      <VBtn :icon="icon" @click="next()" />
      <VMenu>
        <template #activator="{ props }">
          <VBtn v-bind="props" :icon="`circle-flags:${locale}`" />
        </template>
        <VList>
          <VListItem
            v-for="l in availableLocales"
            :key="l"
            @click="setLocale(l)"
          >
            <VIcon :icon="`circle-flags:${l}`" />
          </VListItem>
        </VList>
      </VMenu>
    </VAppBar>
    <VMain class="mt-10">
      <VRow>
        <VCol cols="4">
          <VSheet class="mx-auto" width="300">
            <h4>Custom</h4>
            <VForm ref="form">
              <VTextField
                v-model="modelObject.name"
                :counter="10"
                :rules="customRules.nameRules"
                label="Name"
                required
              />
              <VSelect
                v-model="modelObject.select"
                :clearable="true"
                :items="items"
                :rules="customRules.selectRules"
                label="Item"
                required
              />
              <VCheckbox
                v-model="modelObject.checkbox"
                :rules="customRules.checkboxRules"
                label="Do you agree?"
                required
              />
            </VForm>
          </VSheet>
        </VCol>
        <VCol cols="4">
          <VSheet class="mx-auto" width="300">
            <h4>Zod</h4>
            <VForm ref="form">
              <VTextField
                v-model="modelObject.name"
                label="Name"
                :rules="zodRules.nameRules"
                required
              />
              <VSelect
                v-model="modelObject.select"
                :clearable="true"
                :items="items"
                :rules="zodRules.selectRules"
                label="Item"
                required
              />
              <VCheckbox
                v-model="modelObject.checkbox"
                :rules="zodRules.checkboxRules"
                label="Do you agree?"
                required
              />
            </VForm>
          </VSheet>
        </VCol>
        <VCol cols="4">
          <VSheet class="mx-auto" width="300">
            <h4>Yup</h4>
            <VForm ref="form">
              <VTextField
                v-model="modelObject.name"
                :rules="yupRules.nameRules"
                label="Name"
                required
              />
              <VSelect
                v-model="modelObject.select"
                :clearable="true"
                :items="items"
                :rules="yupRules.selectRules"
                label="Item"
                required
              />
              <VCheckbox
                v-model="modelObject.checkbox"
                :rules="yupRules.checkboxRules"
                label="Do you agree?"
                required
              />
            </VForm>
          </VSheet>
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
    </VMain>
  </VApp>
</template>
