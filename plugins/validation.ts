import { ValidationService } from "~/services/validation/ValidationService";
import { ZodProvider } from "~/services/validation/providers/ZodProvider";
import { YupProvider } from "~/services/validation/providers/YupProvider";

type ValidationProviders = "zod" | "yup";

export default defineNuxtPlugin(() => {
  const validationService = new ValidationService<ValidationProviders>();

  validationService.addProvider("zod", new ZodProvider(), true);
  validationService.addProvider("yup", new YupProvider());

  return {
    provide: {
      validation: validationService,
    },
  };
});
