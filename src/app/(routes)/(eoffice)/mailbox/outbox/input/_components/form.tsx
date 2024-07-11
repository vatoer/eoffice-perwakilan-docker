import {
  getDokumenKeluarForEditing,
  simpanDokumenKeluar,
} from "@/actions/dokumen-keluar";
import { AlertDialogContainer } from "@/components/alert-dialog-container";
import FormRow from "@/components/form/form-row";
import FormRowFile from "@/components/form/form-row-file";
import { Button } from "@/components/ui/button";
import useFileStore from "@/hooks/use-file-store";
import { cn } from "@/lib/utils";
import beritaKeluarSchema, {
  BeritaKeluar,
  BeritaKeluarEditMode,
  beritaKeluarEditModeSchema,
} from "@/zod/schemas/berita-keluar";
import PeekBerita, {
  BeritaBasicInfo,
} from "@eoffice/mailbox/_components/peek-berita";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormRowFungsiPengirim from "./form-row-fungsi";

type FormValues<T> = T extends true ? BeritaKeluarEditMode : BeritaKeluar;

interface FormOutboxProps {
  editId?: string | null;
}
const FormOutbox = ({ editId }: FormOutboxProps) => {
  const isEditMode = editId !== null;
  type EditMode = typeof isEditMode;

  const methods = useForm<FormValues<EditMode>>({
    resolver: zodResolver(
      isEditMode ? beritaKeluarEditModeSchema : beritaKeluarSchema
    ),
  });
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;
  const router = useRouter();

  const setFileUrl = useFileStore((state) => state.setFileUrl);
  const handleFileChange = (file: File | null) => {
    if (file !== null) {
      const fileUrl = URL.createObjectURL(file);
      setFileUrl(fileUrl);
    } else {
      setFileUrl(null);
    }
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [beritaBaru, setBeritaBaru] = useState<BeritaBasicInfo | null>(null);

  const onSubmit = async (beritakeluar: FormValues<EditMode>) => {
    console.log(beritakeluar);
    console.log("submitting");
    const formData = new FormData();

    const { berita_file, ...rest } = beritakeluar; // destructuring

    const jsonBeritaKeluar = JSON.stringify(rest);
    formData.append("berita_keluar", jsonBeritaKeluar);

    // file diperlakukan secara khusus krn zod tidak bisa menghandle file upload
    if (beritakeluar.berita_file instanceof File) {
      formData.append("file", beritakeluar.berita_file as File);
    }

    const simpan = await simpanDokumenKeluar(formData);
    if (simpan.success) {
      setBeritaBaru(simpan.data as BeritaBasicInfo);
      setDialogOpen(true);
      if (!isEditMode) {
        setFileUrl(null);
        reset();
      }
      if (isEditMode) {
        setTimeout(() => {
          // router push to outbox
          router.push("/mailbox/outbox");
        }, 1000);
      }
    } else {
      alert(simpan.error);
    }
    console.log(simpan);
    console.log(formData);
  };

  // fetching data if edit mode
  // 'isEditMode', 'reset', and 'setFileUrl' are dependencies that are not changed from the first render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isEditMode && editId) {
      // fetch data
      const fetchBerita = async () => {
        const berita = await getDokumenKeluarForEditing(editId);
        console.log(berita);
        if (berita.success) {
          if (berita.data) {
            setFileUrl(`/api/files?id=${berita.data.arsip_kd}&inout=keluar`);
            reset(berita.data);
          }
        } else {
          alert(berita.error);
        }
      };
      fetchBerita();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  return (
    <FormProvider {...methods}>
      <AlertDialogContainer
        open={dialogOpen}
        setOpen={setDialogOpen}
        title="Berhasil"
        description="Dokumen berhasil disimpan"
      >
        <PeekBerita berita={beritaBaru} />
      </AlertDialogContainer>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 py-2 w-full lg:max-w-screen-lg mx-auto justify-start items-start "
      >
        <FormRowFile
          name="berita_file"
          label="File Berita"
          onFileChange={handleFileChange}
        />
        <FormRow errors={errors} fullKey="berita_kd" label="Nomor Dokumen">
          <input
            id="berita_kd"
            {...register("berita_kd")}
            type="text"
            className="border-2 border-gray-300 p-2 rounded w-full"
          />
        </FormRow>
        <FormRow errors={errors} fullKey="perihal_berita" label="Perihal">
          <textarea
            id="perihal_berita"
            rows={2}
            {...register("perihal_berita")}
            className="border-2 border-gray-300 p-1 rounded w-full"
          />
        </FormRow>
        <FormRowFungsiPengirim
          fullKey="pembuat_kd"
          label="Fungsi Pembuat"
          isMulti={false}
        />
        <FormRowFungsiPengirim
          fullKey="copy_berita"
          label="Copy berita ke"
          isMulti={true}
        />

        <div className="w-full md:mt-4 px-2">
          <div className="ml-auto md:w-2/3 flex flex-row gap-2">
            <Button
              type="submit"
              className={cn("w-2/3")}
              disabled={isSubmitting}
              variant={"default"}
            >
              Simpan
              {isSubmitting && <Loader className="w-6 h-6 animate-spin" />}
            </Button>
            <Button
              type="button"
              className=""
              variant={"outline"}
              onClick={() => router.push("/mailbox/outbox")}
            >
              Batal
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default FormOutbox;
