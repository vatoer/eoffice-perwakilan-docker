import FormRow from "@/components/form/form-row";
import { Button } from "@/components/ui/button";
import { getAlamat } from "@/data/alamat";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import AsyncSelect from "react-select/async";

interface FormRowPengirimProps {
  fullKey: string;
  defaultValue?: Option | null;
  onClickNewPengirim: () => void;
}

interface Option {
  value: number;
  label: string;
}

const FormRowPengirim = ({
  fullKey,
  defaultValue,
  onClickNewPengirim,
}: FormRowPengirimProps) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    defaultValue || null
  );
  const [initialLoad, setInitialLoad] = useState(true);

  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    if (inputValue.length < 3) return [];

    try {
      const optionAlamat = await getAlamat(inputValue);
      const mappedOptions = optionAlamat.map(
        ({ perwakilan_kd, perwakilan_nama }) => ({
          value: perwakilan_kd,
          label: perwakilan_nama,
        })
      );
      setOptions(mappedOptions);
      return mappedOptions;
    } catch (error) {
      console.error("Failed to load options:", error);
      return [];
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedLoadOptions = useCallback(
    debounce((inputValue: string, callback: (options: Option[]) => void) => {
      loadOptions(inputValue).then(callback).catch(console.error);
    }, 500),
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (defaultValue && initialLoad) {
      setValue(fullKey, defaultValue.value);
      setSelectedOption(defaultValue);
      setInitialLoad(false);
    }
    // Omitting fullKey and setValue from the dependency array because they are stable and do not change over the component's lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, initialLoad]);

  return (
    <FormRow
      errors={errors}
      fullKey={fullKey}
      label="Instansi Pengirim"
      ignoreFor
      className=""
    >
      <div className="w-full flex-row flex gap-4">
        <Controller
          name={fullKey}
          control={control}
          render={({ field }) => (
            <AsyncSelect
              className="w-full"
              placeholder="ketikkan minimal 3 huruf untuk mencari instansi pengirim"
              instanceId={fullKey}
              onChange={(option) => {
                field.onChange(option ? option.value : null);
                setSelectedOption(option);
              }}
              value={selectedOption}
              onBlur={field.onBlur}
              cacheOptions
              isClearable
              defaultOptions
              loadOptions={debouncedLoadOptions}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value.toString()}
            />
          )}
        />
        <div className="">
          <Button
            className="h-10"
            variant={"outline"}
            type="button"
            onClick={() => {
              onClickNewPengirim();
            }}
          >
            + baru
          </Button>
        </div>
      </div>
    </FormRow>
  );
};

export default FormRowPengirim;
