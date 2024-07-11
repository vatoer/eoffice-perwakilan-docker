import FormRow from "@/components/form/form-row";
import { Controller, useFormContext } from "react-hook-form";

interface FormRowFileProps {
  onFileChange?: (file: File | null) => void;
  ref?: React.RefObject<HTMLInputElement>;
}
export const FormRowFile = ({ onFileChange, ref }: FormRowFileProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormRow errors={errors} fullKey="berita_file" label="File Dokumen">
      <Controller
        name="berita_file"
        control={control}
        render={({ field }) => (
          <input
            ref={ref}
            id="berita_file"
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
