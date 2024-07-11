import {
  CombinedErrors,
  getErrorMessage,
  hasError,
} from "@/components/form/utils";

export const ErrorText = ({
  errors,
  fullKey,
}: {
  errors: CombinedErrors;
  fullKey: string;
}) => {
  if (!hasError(errors, fullKey)) {
    return;
  }

  const errorMessage = getErrorMessage(fullKey, errors);

  if (errorMessage === null) {
    return null;
  }

  return errorMessage ? (
    <p key={fullKey + "Error"} className="text-red-500">
      {errorMessage}
    </p>
  ) : null;
};

export default ErrorText;
