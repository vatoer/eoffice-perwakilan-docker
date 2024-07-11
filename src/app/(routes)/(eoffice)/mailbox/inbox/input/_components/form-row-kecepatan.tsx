import FormRow from "@/components/form/form-row";
import { CombinedErrors } from "@/components/form/utils";
import { getJenisBerita } from "@/data/jenis-berita";
import React, { useEffect, useState } from "react";
import { Controller, UseFormRegister, useFormContext } from "react-hook-form";
import Select, { SingleValue } from "react-select";

interface FormRowKecepatanProps {
  fullKey: string;
}

interface Option {
  value: string;
  label: string;
}

const FormRowKecepatan = ({ fullKey }: FormRowKecepatanProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const options: Option[] = [
    { value: "000", label: "Biasa" },
    { value: "111", label: "Segera" },
    { value: "222", label: "Sangat Segera" },
    { value: "333", label: "Kilat" },
  ];

  return (
    <FormRow
      errors={errors}
      fullKey={fullKey}
      label="Derajat Kecepatan"
      ignoreFor
    >
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

export default FormRowKecepatan;
