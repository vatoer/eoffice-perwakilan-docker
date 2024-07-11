import FormRow from "@/components/form/form-row";
import { getFungsi } from "@/data/fungsi";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select, { ActionMeta, MultiValue, SingleValue } from "react-select";
import { v4 as uuidv4 } from "uuid"; // Import uuid to generate unique IDs

interface FormRowFungsiPengirimProps {
  fullKey: string;
  label: string;
  isMulti: boolean;
}

interface Option {
  value: number;
  label: string;
}

const FormRowFungsiPengirim = ({
  fullKey,
  label,
  isMulti,
}: FormRowFungsiPengirimProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [options, setOptions] = useState<Option[]>([]);
  const [inputValue, setInputValue] = useState(""); // Step 1: Add state for input value
  const [instanceId] = useState(uuidv4()); // Generate a unique instanceId

  useEffect(() => {
    const fetchOptions = async () => {
      const optionFungsiPengirim = await getFungsi();
      if (optionFungsiPengirim) {
        const mappedOptions = optionFungsiPengirim.map((fungsi) => ({
          value: fungsi.fungsi_kd,
          label: fungsi.nama_fungsi,
        }));
        setOptions(mappedOptions);
      }
    };

    fetchOptions();
  }, []);

  return (
    <FormRow errors={errors} fullKey={fullKey} label={label} ignoreFor>
      <Controller
        name={fullKey}
        control={control}
        render={({ field }) => (
          <Select
            isMulti={isMulti}
            instanceId={instanceId}
            options={options}
            isClearable
            closeMenuOnSelect={!isMulti}
            onChange={(
              option: SingleValue<Option> | MultiValue<Option>,
              actionMeta: ActionMeta<Option>
            ) => {
              const newValue = isMulti
                ? (option as MultiValue<Option>).map((opt) => opt.value)
                : (option as SingleValue<Option>)?.value || null;
              field.onChange(newValue);
              if (!isMulti) setInputValue(""); // Optionally reset input value on select for single select
              //setInputValue(""); // Reset input value on select for both single and multi-select
            }}
            onInputChange={(value, actionMeta) => {
              if (actionMeta.action === "input-change") {
                setInputValue(value); // Step 2: Update input value on change
              }
            }}
            inputValue={inputValue} // Step 3: Control input value
            value={
              isMulti
                ? options.filter((option) =>
                    Array.isArray(field.value)
                      ? field.value.includes(option.value)
                      : false
                  )
                : options.find((option) => option.value === field.value) || null
            }
            filterOption={(option, inputValue) =>
              option.label.toLowerCase().includes(inputValue.toLowerCase())
            }
            onBlur={() => setInputValue("")} // Step 4: Reset input on dropdown close
          />
        )}
      />
    </FormRow>
  );
};

export default FormRowFungsiPengirim;
