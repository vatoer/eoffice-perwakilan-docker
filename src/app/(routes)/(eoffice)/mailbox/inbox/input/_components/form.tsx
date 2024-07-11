"use client";
import {
  getDokumenMasukForEditing,
  simpanDokumenMasuk,
} from "@/actions/dokumen";
import { AlertDialogContainer } from "@/components/alert-dialog-container";
import InputDatePicker from "@/components/date-picker/input-date-picker";
import FormRow from "@/components/form/form-row";
import { Button } from "@/components/ui/button";
import useFileStore from "@/hooks/use-file-store";
import beritaSchema, {
  Berita,
  BeritaEditMode,
  BeritaWithoutFile,
  beritaEditModeSchema,
} from "@/zod/schemas/berita";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import PeekBerita from "../../../_components/peek-berita";
import { FormPengirimBaru } from "./form-pengirim-baru";
import FormRowDisposisiOleh from "./form-row-disposisi-oleh";
import FormRowFile from "./form-row-file";
import FormRowJenisDokumen from "./form-row-jenis-dokumen";
import FormRowKecepatan from "./form-row-kecepatan";
import FormRowPengirim from "./form-row-pengirim";

type FormValues<T> = T extends true ? BeritaEditMode : Berita;

interface FormInboxProps {
  editId?: string | null;
}

const FormInbox = ({ editId }: FormInboxProps) => {
  const isEditMode = editId !== null;
  type FormMode = typeof isEditMode;

  console.log("editId", editId);
  const methods = useForm<FormValues<FormMode>>({
    resolver: zodResolver(isEditMode ? beritaEditModeSchema : beritaSchema),
    defaultValues: {
      tgl_berita: new Date(),
      derajat_kd: "000",
      jenis_kd: 3,
      berita_fungsi_disposisi: 27,
      keterangan: "-",
    },
  });

  const {
    register,
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const [open, setOpen] = useState(false);
  const [openFormPengirimBaru, setOpenFormPengirimBaru] = useState(false);
  const [beritaBaru, setBeritaBaru] = useState<Berita | null>(null);
  const [selectedPengirim, setSelectedPengirim] = useState<number | null>(null);
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearSpecificFields = () => {
    setValue("perihal_berita", "");
    setValue("berita_kd", "");
    setValue("keterangan", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOnClosePengirimBaru = () => {
    setOpenFormPengirimBaru(false);
  };

  const clearSelectionPengirim = () => {
    setSelectedPengirim(null);
  };

  const onSubmit = async (data: FormValues<FormMode>) => {
    console.log(data);
    console.log("submitting");
    type Berita = typeof data;
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key as keyof Berita];
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      }
    }
    formData.append("file", data.berita_file as File);
    formData.append("berita", JSON.stringify(data));
    console.log(formData);

    const dokumenMasuk = await simpanDokumenMasuk(formData);
    console.log("dokumenMasuk", dokumenMasuk);

    if (dokumenMasuk.success) {
      setBeritaBaru(dokumenMasuk.data);
      setOpen(true);
      clearSpecificFields();
      clearSelectionPengirim();
      setFileUrl(null);
      toast.success(dokumenMasuk.message);

      if (!isEditMode) {
        reset();
      }

      if (isEditMode) {
        setTimeout(() => {
          // router push to inbox
          router.push("/mailbox/inbox");
        }, 1000);
      }
    } else {
      toast.error("Gagal menyimpan dokumen");
      // toast.error(dokumenMasuk.);
    }
  };

  interface Option {
    value: number;
    label: string;
  }

  const [isFetching, setIsFetching] = useState(false);
  const defaultOptionPengirim = useRef<Option | null>(null);

  useEffect(() => {
    const fetchingData = async (
      editId: string
    ): Promise<BeritaWithoutFile | null> => {
      const response = await getDokumenMasukForEditing(editId);
      if (response.success) {
        const data = response.data;
        console.log("[fetchingData]", data);
        if (!data) return null;
        setFileUrl(`/api/files?id=${data.arsip_kd}&inout=masuk`);
        reset(data);
        setSelectedPengirim(data.perwakilan_kd);
        defaultOptionPengirim.current = {
          value: data.perwakilan_kd,
          label: data.perwakilan_nama || "",
        };

        console.log("defaultOptionPengirim", defaultOptionPengirim.current);

        return data;
      }
      return null;
    };

    if (editId) {
      setIsFetching(true);
      console.log("use effect", editId);
      fetchingData(editId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  return (
    <>
      <AlertDialogContainer
        open={open}
        setOpen={setOpen}
        title="Berhasil"
        description="Dokumen berhasil disimpan"
      >
        <PeekBerita berita={beritaBaru} />
      </AlertDialogContainer>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 py-2 max-w-screen-lg mx-auto justify-start items-start "
        >
          <FormRowFile onFileChange={handleFileChange} />

          <FormRow errors={errors} fullKey="berita_kd" label="Nomor Dokumen">
            <input
              id="berita_kd"
              {...register("berita_kd")}
              type="text"
              className="border-2 border-gray-300 p-2 rounded w-full"
            />
          </FormRow>

          <FormRowJenisDokumen fullKey="jenis_kd" />

          <FormRowKecepatan fullKey="derajat_kd" />

          <FormRow errors={errors} fullKey="sifat_kd" label="Sifat Dokumen">
            <select
              id="sifat_kd"
              {...register("sifat_kd")}
              className="border-2 border-gray-300 p-2 rounded w-full"
            >
              <option value="1" className="p-2">
                Biasa
              </option>
              <option value="2" className="p-2">
                Rahasia
              </option>
            </select>
          </FormRow>

          <FormRowPengirim
            fullKey="perwakilan_kd"
            defaultValue={defaultOptionPengirim.current}
            onClickNewPengirim={() => setOpenFormPengirimBaru(true)}
          />

          <FormRow
            errors={errors}
            fullKey="jabatan_pengirim"
            label="Jabatan Pengirim"
          >
            <input
              id="jabatan_pengirim"
              {...register("jabatan_pengirim")}
              type="text"
              className="border-2 border-gray-300 p-2 rounded w-full"
            />
          </FormRow>

          <FormRow errors={errors} fullKey="tgl_berita" label="Tanggal Dokumen">
            <InputDatePicker
              label="Tanggal Dokumen"
              name="tgl_berita"
              error={errors.tgl_berita}
              className="md:w-1/4"
              calendarOptions={{
                toDate: new Date(),
              }}
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

          <FormRow errors={errors} fullKey="keterangan" label="Keterangan">
            <textarea
              id="keterangan"
              rows={2}
              {...register("keterangan")}
              className="border-2 border-gray-300 p-1 rounded w-full"
            />
          </FormRow>

          <FormRow
            errors={errors}
            fullKey="berita_disposisikan"
            label="Disposisikan Dokumen"
          >
            <select
              id="berita_disposisikan"
              {...register("berita_disposisikan")}
              className="border-2 border-gray-300 p-2 rounded w-full"
            >
              <option value="Y">Ya</option>
              <option value="T">Tidak</option>
            </select>
          </FormRow>

          <FormRowDisposisiOleh fullKey="berita_fungsi_disposisi" />

          <div className="w-full md:mt-4 px-2">
            <div className="ml-auto md:w-2/3 flex flex-row gap-2">
              <Button type="submit" className="w-2/3" variant={"default"}>
                Simpan
              </Button>
              <Button
                className=""
                variant={"outline"}
                type="button"
                onClick={() => router.push("/mailbox/inbox")}
              >
                Batal
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>

      <FormPengirimBaru
        isOpen={openFormPengirimBaru}
        onClose={handleOnClosePengirimBaru}
      />
    </>
  );
};

export default FormInbox;
