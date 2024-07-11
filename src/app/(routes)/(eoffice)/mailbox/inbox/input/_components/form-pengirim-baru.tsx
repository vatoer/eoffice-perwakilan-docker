import { simpanPerwakilanBaru } from "@/actions/perwakilan";
import { Button } from "@/components/ui/button";
import { Perwakilan } from "@/data/alamat";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import "tailwindcss/tailwind.css";
import { z } from "zod";
import SelectNegara from "./select-negara";

const schema = z.object({
  perwakilan_nama: z.string().min(1, "Nama is required"),
  negara: z.string().min(3, "Negara is required"),
});

// type FormValues = z.infer<typeof schema>;

interface FormPengirimBaruProps {
  isOpen: boolean;
  onClose: () => void;
}
export const FormPengirimBaru = ({
  isOpen,
  onClose,
}: FormPengirimBaruProps) => {
  const methods = useForm<Perwakilan>({
    resolver: zodResolver(schema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: Perwakilan) => {
    console.log(data);
    const response = await simpanPerwakilanBaru(data);
    if (response.success) {
      console.log("Success");
      onClose();
    } else {
      console.error(response.error);
      toast.error(response.error);
    }

    // onClose(); // Close the modal after submission
  };

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="nama" className="block text-gray-700">
                Nama Instansi / Pengirim
              </label>
              <input
                id="nama"
                {...register("perwakilan_nama")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {errors.perwakilan_nama && (
                <p className="text-red-500">{errors.perwakilan_nama.message}</p>
              )}
            </div>
            <div className="mb-4">
              <span className="block text-gray-700">Negara</span>
              <SelectNegara fullKey="negara" />
              {errors.negara && (
                <p className="text-red-500">{errors.negara.message}</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="submit">Simpan</Button>
              <Button type="button" onClick={onClose} variant={"outline"}>
                Close
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
