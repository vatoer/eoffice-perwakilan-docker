"use client";
import { simpanDisposisi } from "@/actions/disposisi";
import { Button } from "@/components/ui/button";
import type { Disposisi } from "@/data/disposisi";
import { getDisposisi } from "@/data/disposisi";
import { FungsiGroup } from "@/data/fungsi";
import { useModeDisposisi } from "@/hooks/use-mode-disposisi";
import { useInbox } from "@/hooks/use-surat";
import { useSuratId } from "@/hooks/use-surat-id";
import { useToggleFormDispo } from "@/hooks/use-toggle-form-dispo";
import { cn } from "@/lib/utils";
import { tbl_fungsi, tbl_instruksi } from "@prisma-dbedispo/client";
import { Loader } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import DisposisiCatatan from "./form-disposisi-catatan";
import DisposisiFungsi from "./form-disposisi-fungsi";
import DisposisiInstruksi from "./form-disposisi-instruksi";

interface FormDisposisiProps {
  instruksi: tbl_instruksi[];
  fungsi: tbl_fungsi[];
  fungsiGroup: FungsiGroup[];
  user_fungsi_kd: number;
}

const FormDisposisi = ({
  instruksi,
  fungsi,
  fungsiGroup,
  user_fungsi_kd,
}: FormDisposisiProps) => {
  const { suratId } = useSuratId();
  const { onOff, toggle } = useToggleFormDispo();
  const { inbox } = useInbox();

  const [checkedItems, setCheckedItems] = useState<{ [key: string]: number }>(
    {}
  );
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { modeDisposisi, setModeDisposisi } = useModeDisposisi();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!suratId) throw new Error("No suratId found");
        console.log("Fetching data for suratId", suratId);
        const disposisi = await getDisposisi(suratId);
        console.log("disposisi", disposisi);
        setData(disposisi, setCheckedItems, checkedItems); // Assuming setData is used somewhere
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (suratId) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suratId]);

  const handleCatatanChange = useCallback((value: string) => {
    setCatatan(value);
    console.log("Received catatan from child:", value);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const groupedItems: { [key: string]: { [subKey: number]: number } } = {};

    Object.entries(checkedItems).forEach(([key, value]) => {
      const prefixMatch = key.match(/^(instruksi|fg|f)_(\d+)$/);
      if (prefixMatch) {
        const prefix = prefixMatch[1];
        const subKey = prefixMatch[2];
        if (!groupedItems[prefix]) groupedItems[prefix] = {};
        groupedItems[prefix][Number(subKey)] = value;
      } else {
        console.error(`Unexpected key format: ${key}`);
      }
    });

    const instruksiJson = JSON.stringify(groupedItems.instruksi);
    const fungsiJson = JSON.stringify(groupedItems.f);

    if (!suratId) {
      console.error("No suratId found");
      return;
    }

    if (!groupedItems.instruksi) {
      console.error("No instruksi found");
      toast.error("Instruksi harus dipilih");
      return;
    }

    try {
      //  TODO sesuaikan dengan return response yg konsisten
      const disposisi = await simpanDisposisi(
        suratId,
        groupedItems.instruksi,
        groupedItems.f,
        catatan
      );

      // if (!disposisi) {
      //   console.error("No disposisi found");
      //   return;
      // }

      // if (disposisi instanceof Error) {
      //   console.error("Error saving disposisi", disposisi.message);
      //   return;
      // }

      setModeDisposisi("R");

      console.log("disposisi", disposisi);
      setIsSubmitting(false);

      toast.success("Disposisi berhasil disimpan");
    } catch (error) {
      console.error("Error saving disposisi", error);
    }
  };

  if (!suratId) {
    console.error("No suratId found");
    return null;
  }

  if (inbox) {
    // hanya fungsi yang sama dengan fungsi disposisi yang bisa disposisi
    if (inbox.berita_fungsi_disposisi !== user_fungsi_kd) {
      console.error("Fungsi tidak sama dengan fungsi disposisi");
      return null;
    }
    // jika sudah disposisi, tidak bisa disposisi lagi
    // TODO : jika edit bagaimana ?
    if (inbox.disposisi_kd) {
      //return null;
      console.log("Disposisi sudah ada");
      // TODO : edit disposisi
    }
  }

  type SetCheckedItemsFunction = (prevItems: Record<string, number>) => void;

  const setData = (
    disposisi: Disposisi | null,
    setCheckedItems: Dispatch<
      SetStateAction<{
        [key: string]: number;
      }>
    >,
    checkedItems: { [key: string]: number }
  ) => {
    setCheckedItems({});
    if (!disposisi) {
      console.error("No disposisi found");
      return;
    }

    if (disposisi.instruksi) {
      disposisi.instruksi.forEach((instruksiItem) => {
        const key = `instruksi_${instruksiItem.instruksi_kd}`;
        setCheckedItems((prevItems) => ({ ...prevItems, [key]: 1 }));
        // Update the state of the group checkbox
        // setCheckedItems((prevCheckedItems) => ({
        //   ...prevCheckedItems,
        //   [key]: 1,
        // }));
      });
    }

    if (disposisi.tbl_disposisi_detail) {
      disposisi.tbl_disposisi_detail.forEach((detail) => {
        const key = `f_${detail.detail_fungsi_kd}`;
        setCheckedItems((prevItems) => ({
          ...prevItems,
          [key]: detail.detail_perhatian === "Y" ? 2 : 1,
        }));
        // Update the state of the group checkbox
        // setCheckedItems((prevCheckedItems) => ({
        //   ...prevCheckedItems,
        //   [key]: detail.detail_perhatian === "Y" ? 2 : 1,
        // }));
      });
    }

    // console.log("setDatas"); // Remove unnecessary console.log
  };

  if (loading)
    return (
      <div
        className={cn(
          "p-4 md:w-full lg:w-[550px] flex flex-row gap-2 h-[calc(100vh-135px)] bg-gray-300",
          {
            hidden: !onOff,
          }
        )}
      >
        Loading disposisi...
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      className={cn("top-16 bg-gray-300 shadow-lg p-4 md:w-full lg:w-[550px]", {
        hidden: !onOff,
      })}
    >
      <div className="mb-2">
        <span className="font-semibold">Disposisi</span>
        <span>
          {suratId ? ` untuk agenda ${suratId}` : " (No suratId found)"}
        </span>
      </div>
      <div className="w-full flex flex-row gap-2 h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden ">
        <div className="border border-gray-100">
          <DisposisiFungsi
            fungsi={fungsi}
            fungsiGroup={fungsiGroup}
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
          />
        </div>
        <div className="border border-gray-100 gap-2 h-full">
          <div>
            <DisposisiInstruksi
              instruksi={instruksi}
              checkedItems={checkedItems}
              setCheckedItems={setCheckedItems}
            />
          </div>
          <div className="mt-2 p-2">
            <DisposisiCatatan onCatatanChange={handleCatatanChange} />
          </div>
          <div className="flex w-full justify-end p-2">
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              Disposisikan
              {isSubmitting && <Loader className="w-6 h-6 animate-spin" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormDisposisi;
