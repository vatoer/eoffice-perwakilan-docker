import FormRow from "@/components/form/form-row";
import { Controller, useFormContext } from "react-hook-form";

interface FormRowFileProps {
  name: string;
  label: string;
  onFileChange?: (file: File | null) => void;
}
export const FormRowFile = ({
  name,
  label,
  onFileChange,
}: FormRowFileProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormRow errors={errors} fullKey={name} label={label}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={name}
            type="file"
            accept=".pdf"
            className="border-2 border-gray-300 p-2 rounded w-full"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              field.onChange(file);
              onFileChange && onFileChange(file);
            }}
          />
        )}
      />
    </FormRow>
  );
};

export default FormRowFile;
