import FormRow from "@/components/form/form-row";
import { CombinedErrors } from "@/components/form/utils";
import { Controller, useFormContext } from "react-hook-form";

interface FormRowSifatProps {
  fullKey: string;
}

const FormRowSifat = ({ fullKey }: FormRowSifatProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormRow errors={errors} fullKey="sifat_kd" label="Sifat Dokumen" ignoreFor>
      <div>
        <Controller
          name="sifat_kd"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <input
                id="sifat_kd_biasa"
                type="radio"
                value="1"
                onChange={onChange}
                onBlur={onBlur}
                checked={value === "1"}
                className="mr-1"
              />
              <label htmlFor="sifat_kd_biasa" className="mr-4">
                Biasa
              </label>
              <input
                id="sifat_kd_rahasia"
                type="radio"
                value="2"
                onChange={onChange}
                onBlur={onBlur}
                checked={value === "2"}
                className="mr-1"
              />
              <label htmlFor="sifat_kd_rahasia">Rahasia</label>
            </>
          )}
        />
      </div>
    </FormRow>
  );
};

export default FormRowSifat;
