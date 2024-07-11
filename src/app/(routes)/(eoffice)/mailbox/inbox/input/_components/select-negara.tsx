"use client";
import { getNegara } from "@/actions/negara";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select, { SingleValue } from "react-select";

interface SelectNegaraProps {
  fullKey: string;
}

interface Option {
  value: string;
  label: string;
}

const SelectNegara = ({ fullKey }: SelectNegaraProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const optionsNegara = await getNegara();
      if (optionsNegara.success) {
        const mappedOptions = optionsNegara.data.map((negara) => ({
          value: negara.kode_negara,
          label: negara.nama_negara + " (" + negara.kode_negara + ")",
        }));
        setOptions(mappedOptions);
      }
    };

    fetchOptions();
  }, []);

  return (
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
          value={options.find((option) => option.value === field.value) || null}
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value.toString()}
          filterOption={(option, inputValue) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
          }
        />
      )}
    />
  );
};

export default SelectNegara;
