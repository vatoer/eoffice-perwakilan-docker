import generateNomor from "@/actions/penomoran";
import { AlertDialogContainer } from "@/components/alert-dialog-container";
import InputDatePicker from "@/components/date-picker/input-date-picker";
import FormRow from "@/components/form/form-row";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useFileStore from "@/hooks/use-file-store";
import { cn } from "@/lib/utils";
import dokumenKeluarSchema, { DokumenKeluar } from "@/zod/schemas/penomoran";
import uploadFileSchema, { UploadFile } from "@/zod/schemas/upload-file";
import { BeritaBasicInfo } from "@eoffice/mailbox/_components/peek-berita";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { DokumenKeluarPreview } from "./dokumen-keluar";
import { FormRowFungsi } from "./form-row-fungsi";
import FormRowJenis from "./form-row-jenis";
import FormRowSifat from "./form-row-sifat";

interface FormPenomoranProps {
  handleChangeJenis: (value: string) => void;
  handleOnSave: (dokumen: DokumenKeluar) => void;
}

const FormPenomoran = ({
  handleChangeJenis,
  handleOnSave,
}: FormPenomoranProps) => {
  const methods = useForm<DokumenKeluar>({
    resolver: zodResolver(dokumenKeluarSchema),
    defaultValues: {
      tanggalDokumen: new Date(),
      tujuan: "-",
    },
  });

  const {
    register,
    control,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = methods;

  const methodsUpload = useForm<UploadFile>({
    resolver: zodResolver(uploadFileSchema),
  });

  const {
    register: registerUpload,
    control: controlUpload,
    handleSubmit: handleSubmitUpload,
    formState: { errors: errorsUpload },
  } = methodsUpload;

  const setFileUrl = useFileStore((state) => state.setFileUrl);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogFiturOpen, setDialogFiturOpen] = useState(false);
  const [beritaBaru, setBeritaBaru] = useState<BeritaBasicInfo | null>(null);
  const [formReady, setFormReady] = useState(true);
  const [dokumenKeluar, setDokumenKeluar] = useState<DokumenKeluar | null>(
    null
  );
  const [fileTobeUploaded, setFileTobeUploaded] = useState<File | null>(null);

  const handleFileChange = (file: File | null) => {
    if (file !== null) {
      const fileUrl = URL.createObjectURL(file);
      setFileTobeUploaded(file);
      setFileUrl(fileUrl);
    } else {
      setFileUrl(null);
    }
  };

  const onSubmit = async (dokumenKeluar: DokumenKeluar) => {
    try {
      console.log(dokumenKeluar);
      console.log("submitting");
      const generate = await generateNomor(dokumenKeluar);
      if (generate.success) {
        setValue("nomor", generate.data.dokumen.nomor);
        setDialogOpen(true);
        setFormReady(false);
        setDokumenKeluar(generate.data.dokumen);
        handleOnSave(generate.data.dokumen);
      } else {
        toast.error("Gagal menyimpan dokumen");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan dokumen");
    }
  };

  const onSubmitUpload = async (data: UploadFile) => {
    setDialogFiturOpen(true);
  };

  const handleBuatBaru = () => {
    reset();
    setFileUrl(null);
    setFormReady(true);
    setDokumenKeluar(null);
  };

  // Watch for changes in the "jenis" field
  const jenis = useWatch({
    control,
    name: "jenis",
  });

  useEffect(() => {
    if (jenis) {
      handleChangeJenis(jenis);
    }
  }, [jenis, handleChangeJenis]);

  return (
    <div className="h-auto">
      <FormProvider {...methods}>
        <DokumenKeluarPreview
          dokumen={dokumenKeluar}
          className="flex flex-col p-2 md:px-4 gap-2 w-full lg:max-w-screen-lg mx-auto justify-start items-start"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div
            className={cn(
              "relative",
              "flex flex-col gap-2 py-2 w-full lg:max-w-screen-lg mx-auto",
              "justify-start items-start"
            )}
          >
            <FormRow errors={errors} fullKey="nomor" label="Nomor Dokumen">
              <input
                id="nomor"
                {...register("nomor")}
                type="text"
                className="border-2 border-gray-300 p-2 rounded w-full"
                readOnly
                disabled
                placeholder="Otomatis saat klik tombol ambil nomor"
              />
            </FormRow>
            <FormRowJenis fullKey="jenis" />
            <FormRowSifat fullKey="sifat" className="hidden" />
            <FormRow
              errors={errors}
              fullKey="tanggalDokumen"
              label="Tanggal Dokumen"
            >
              <InputDatePicker
                label="Tanggal Dokumen"
                name="tanggalDokumen"
                className="md:w-1/2"
                calendarOptions={{
                  toDate: new Date(),
                }}
              />
            </FormRow>
            <FormRow errors={errors} fullKey="perihal" label="Perihal">
              <textarea
                id="perihal"
                rows={2}
                {...register("perihal")}
                className="border-2 border-gray-300 p-1 rounded w-full"
              />
            </FormRow>
            <FormRowFungsi fullKey="fungsi" label="Fungsi" />
            <FormRow errors={errors} fullKey="tujuan" label="Kepada/Tujuan">
              <textarea
                id="tujuan"
                rows={2}
                {...register("tujuan")}
                className="border-2 border-gray-300 p-1 rounded w-full"
              />
            </FormRow>

            {/* cover input */}
            {dokumenKeluar && !formReady && (
              <div className="absolute inset-0 bg-gray-200 bg-opacity-50 z-10 flex justify-center items-center">
                <span className="text-sm font-semibold bg-red-500 text-white p-4 rounded-md">
                  Silakan upload file atau Buat Baru
                </span>
              </div>
            )}
          </div>

          <div className="w-full md:mt-4 px-2">
            <div className="w-full flex flex-row gap-2 items-center justify-center">
              {formReady && (
                <Button
                  type="submit"
                  className="w-full"
                  variant={"default"}
                  disabled={isSubmitting}
                >
                  Ambil nomor
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* {errors && <pre>{JSON.stringify(errors, null, 2)}</pre>} */}
      </FormProvider>

      <FormProvider {...methodsUpload}>
        {dokumenKeluar && (
          <form
            onSubmit={handleSubmitUpload(onSubmitUpload)}
            className={cn(
              "relative",
              "flex flex-col gap-2 p-2 w-full lg:max-w-screen-lg mx-auto",
              "justify-start items-start"
            )}
          >
            <Controller
              name="file"
              control={controlUpload}
              render={({ field }) => (
                <input
                  type="file"
                  accept=".pdf"
                  className="border-2 border-gray-300 p-2 rounded w-full"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    field.onChange(file);
                    handleFileChange(file);
                  }}
                />
              )}
            />

            {errorsUpload.file && (
              <span className="text-red-500">{errorsUpload.file.message}</span>
            )}

            <Button type="submit" className="w-full" variant={"default"}>
              Upload
            </Button>

            {!formReady && (
              <Button
                type="button"
                onClick={handleBuatBaru}
                className="w-full"
                variant={"outline"}
              >
                Buat Baru
              </Button>
            )}
          </form>
        )}
      </FormProvider>

      <AlertDialogContainer
        open={dialogOpen}
        setOpen={setDialogOpen}
        title="Penomoran berhasil"
        description="Nomor dokumen anda adalah"
      >
        <h1 className="font-semibold text-4xl text-gray-700 underline">
          {getValues("nomor")}
        </h1>
        <span className="">{getValues("perihal")}</span>
        <AlertDialogFooter>
          <p className="text-sm">
            Silakan upload file dokumen anda atau klik tombol Buat Baru untuk
            mengambil nomor dokumen lainnya
          </p>
        </AlertDialogFooter>
      </AlertDialogContainer>

      <AlertDialogContainer
        open={dialogFiturOpen}
        setOpen={setDialogFiturOpen}
        title="Terima kasih"
        description="fitur upload file akan segera hadir"
      >
        <h1>Ini adalah fitur penomoran dokumen keluar eOffice versi beta</h1>
        <h1>
          Saat ini anda dapat mengambil/meng-generate nomor dokumen. Fitur
          upload file akan segera hadir.
        </h1>
        <p>Sampaikan saran dan masukan anda mengeai fitur ini ke tim IT kami</p>
        <p>
          Silakan klik tombol Buat Baru untuk mengambil nomor dokumen lainnya
        </p>
        <AlertDialogFooter></AlertDialogFooter>
      </AlertDialogContainer>
    </div>
  );
};

export default FormPenomoran;
