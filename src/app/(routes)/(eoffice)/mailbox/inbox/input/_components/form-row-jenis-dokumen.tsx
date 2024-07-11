"use client";
import FormRow from "@/components/form/form-row";
import { getJenisBerita } from "@/data/jenis-berita";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select, { SingleValue } from "react-select";

interface FormRowJenisDokumenProps {
  fullKey: string;
}

interface Option {
  value: number;
  label: string;
}

const FormRowJenisDokumen = ({ fullKey }: FormRowJenisDokumenProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const optionJenisDokumen = await getJenisBerita();
      if (optionJenisDokumen) {
        const mappedOptions = optionJenisDokumen.map((jenis) => ({
          value: jenis.jenis_kd,
          label: jenis.jenis_nama,
        }));
        setOptions(mappedOptions);
      }
    };

    fetchOptions();
  }, []);

  return (
    <FormRow errors={errors} fullKey={fullKey} label="Jenis Dokumen">
      <Controller
        name={fullKey}
        control={control}
        render={({ field }) => (
          <Select
            instanceId={fullKey}
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

export default FormRowJenisDokumen;
