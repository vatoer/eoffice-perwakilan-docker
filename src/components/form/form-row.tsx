import { ErrorText } from "@/components/form/error-text";
import { CombinedErrors, toTitleCase } from "@/components/form/utils";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const FormRow = ({
  errors,
  fullKey,
  children,
  className,
  label,
  ignoreFor,
}: {
  errors?: CombinedErrors;
  fullKey: string;
  children: React.ReactNode;
  className?: string;
  label?: string;
  ignoreFor?: boolean;
}) => {
  const computedLabel = useMemo(() => {
    return label ? label : toTitleCase(fullKey.split(".").pop() || "");
  }, [label, fullKey]);

  return (
    <div key={fullKey} className={cn("flex flex-col w-full", className)}>
      <div className="flex flex-col md:flex-row md:gap-2 items-start justify-start text-left w-full px-2 md:px-4">
        <label
          htmlFor={!ignoreFor ? fullKey : undefined}
          className="md:block md:mb-2 font-semibold md:w-44 text-left items-start justify-start w-full"
        >
          {label ? label : toTitleCase(fullKey.split(".").pop() || "")}
        </label>
        <div className="w-full">{children}</div>
      </div>
      {errors && (
        <div className="flex flex-col md:flex-row gap-2 items-center md:w-full px-2 md:px-4">
          <div className="md:w-44" />
          <div className="w-full">
            <ErrorText errors={errors} fullKey={fullKey} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FormRow;
