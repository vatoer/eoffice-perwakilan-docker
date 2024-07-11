import FormRow from "@/components/form/form-row";
import { CombinedErrors } from "@/components/form/utils";
import { getFungsiPendispo } from "@/data/fungsi";
import { getJenisBerita } from "@/data/jenis-berita";
import React, { useEffect, useState } from "react";
import { Controller, UseFormRegister, useFormContext } from "react-hook-form";
import Select, { SingleValue } from "react-select";

interface FormRowDisposisiOlehProps {
  fullKey: string;
}

interface Option {
  value: number;
  label: string;
}

const FormRowDisposisiOleh = ({ fullKey }: FormRowDisposisiOlehProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const optionDisposisiOleh = await getFungsiPendispo();
      if (optionDisposisiOleh) {
        const mappedOptions = optionDisposisiOleh.map((fungsi) => ({
          value: fungsi.fungsi_kd,
          label: fungsi.nama_fungsi,
        }));
        setOptions(mappedOptions);
      }
    };

    fetchOptions();
  }, []);

  return (
    <FormRow errors={errors} fullKey={fullKey} label="Disposisi Oleh" ignoreFor>
      <Controller
        name={fullKey}
        control={control}
        render={({ field }) => (
          <Select
            instanceId={fullKey}
            {...field}
            options={options}
            isClearable
            onChange={(option: SingleValue<Option>) =>
              field.onChange(option ? option.value : null)
            }
            value={
              options.find((option) => option.value === field.value) || null
            }
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value.toString()}
            filterOption={(option, inputValue) =>
              option.label.toLowerCase().includes(inputValue.toLowerCase())
            }
          />
        )}
      />
    </FormRow>
  );
};

export default FormRowDisposisiOleh;
