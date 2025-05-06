import { expect, test } from "@nuxt/test-utils/playwright";

test("test", async ({ page, goto }) => {
  await goto("/");
  await expect(page.getByRole("heading").first()).toHaveText(
    "Welcome to Nuxt!"
  );
});
