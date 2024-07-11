import FormRow from "@/components/form/form-row";
import { Controller, useFormContext } from "react-hook-form";

interface FormRowSifatProps {
  fullKey?: string;
  className?: string;
}

const FormRowSifat = ({ fullKey, className }: FormRowSifatProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormRow
      errors={errors}
      fullKey="sifat"
      label="Sifat Dokumen"
      ignoreFor
      className={className}
    >
      <div>
        <Controller
          name="sifat"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <select
                id="sifat"
                {...register("sifat")}
                className="border-2 border-gray-300 p-2 rounded w-full"
              >
                <option value="1" className="p-2">
                  Biasa
                </option>
                <option value="2" className="p-2">
                  Rahasia
                </option>
              </select>
            </>
          )}
        />
      </div>
    </FormRow>
  );
};

export default FormRowSifat;
