// utils.ts

/**
 * If the utility functions toTitleCase, getErrorMessage, and hasError are specific to the SiswaForm component and not used elsewhere in your application, it's fine to keep them in the same directory as SiswaForm.

However, if these utility functions are or will be used by other components or parts of your application, it's a good practice to place them in a separate utils or helpers directory at the root level of your project or inside a shared directory. This makes it clear that these functions can be shared across different parts of your application.

Here's an example directory structure for your project:

my-app/
├── src/
│   ├── components/
│   │   ├── SiswaForm.tsx
│   │   └── OtherComponent.tsx
│   └── utils/
│       └── index.ts
└── package.json

 */

import { DeepMap, FieldError, FieldErrors, FieldValues } from "react-hook-form";
import { ZodError } from "zod";

export type CombinedErrors =
  | DeepMap<FieldValues, FieldError>
  | FieldError
  | FieldErrors<FieldValues>
  | undefined;

export function toTitleCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1") // insert a space before all capital letters
    .replace(/^./, (char) => char.toUpperCase()); // uppercase the first character
}

export const hasError = (errors: CombinedErrors, fullKey: string) => {
  const keys = fullKey.split(".");
  let currentError: FieldError | FieldErrors<FieldValues> | undefined = errors;

  for (const key of keys) {
    if (!currentError || !(currentError as FieldErrors<FieldValues>)[key]) {
      return false;
    }

    currentError = (currentError as FieldErrors<FieldValues>)[key] as
      | FieldError
      | undefined;
  }

  return true;
};

export const getErrorMessage = (fullKey: string, errors: CombinedErrors) => {
  const keys = fullKey.split(".");
  let currentError: DeepMap<FieldValues, FieldError> | undefined = errors;

  for (const key of keys) {
    if (!currentError || !currentError[key]) {
      return null;
    }

    currentError = currentError[key] as
      | DeepMap<FieldValues, FieldError>
      | undefined;
  }

  // If the error is a ZodError, get the message from the first issue
  if (currentError instanceof ZodError) {
    return currentError.issues[0]?.message;
  }

  return currentError?.message;
};
