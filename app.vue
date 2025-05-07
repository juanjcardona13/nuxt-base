<script setup lang="ts">
const { icon, next } = useThemeToggle();
const { setLocale, locale, availableLocales } = useI18n();
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
    <VMain>
      <VDataTable />
      <slot />
    </VMain>
  </VApp>
</template>
