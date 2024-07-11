"use client";

import { Disposisi, getDisposisi } from "@/data/disposisi";
import { getKorespondensi } from "@/data/korespondensi";
import { useSuratId } from "@/hooks/use-surat-id";
import { useToggleFormDispo } from "@/hooks/use-toggle-form-dispo";
import { cn } from "@/lib/utils";
import { formatDateAgo } from "@/utils/date/ago";
import {
  tbl_fungsi,
  tbl_instruksi,
  tbl_korespondensi,
} from "@prisma-dbedispo/client";
import { LucideCheck, LucideCheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { FaUserClock } from "react-icons/fa";

interface LembarDisposisiProps {
  user_fungsi_kd: number;
  fungsi: tbl_fungsi[];
  instruksi: tbl_instruksi[];
  className?: string;
}
const LembarDisposisi = ({
  user_fungsi_kd,
  fungsi,
  instruksi,
  className,
}: LembarDisposisiProps) => {
  const { suratId } = useSuratId();
  const { onOff, toggle } = useToggleFormDispo();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [disposisi, setDisposisi] = useState<Disposisi | null>(null);
  const [korespondensi, setkorespondensi] = useState<
    tbl_korespondensi[] | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!suratId) throw new Error("No suratId found");
        console.log("Fetching data for suratId", suratId);
        const disposisi = await getDisposisi(suratId);
        const korespondensi = await getKorespondensi(suratId);
        console.log("disposisi", disposisi);
        setDisposisi(disposisi); // Assuming setData is used somewhere
        setkorespondensi(korespondensi);
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

  if (loading) {
    return (
      <div
        className={cn(
          !onOff && "hidden",
          "md:w-full lg:w-1/3 p-4 h-[calc(100vh-125px)]",
          " bg-gray-100"
        )}
      >
        Loading disposisi...
      </div>
    );
  }

  if (error) {
    return <div className="w-1/4 bg-red-100">Error: {error}</div>;
  }

  if (!disposisi) {
    console.error("[LEMBAR DISPOSISI] Disposisi not found");
    return null;
  }

  return (
    <div
      className={cn(
        "w-full lg:w-1/3 p-4 bg-gray-100 ",
        "overflow-y-auto overflow-x-hidden h-[calc(100vh-125px)]",
        !onOff && "hidden",
        className && className
      )}
    >
      <div className="flex flex-col w-full">
        <div>
          <h1 className="font-semibold mt-4 mb-2">Instruksi</h1>
          <div className="flex flex-col gap-1">
            {disposisi.instruksi?.map((item) => {
              // map instruksi ke master tbl_instruksi untuk mendapatkan nama instruksi
              const namedInstruksi = instruksi.find(
                (instruksi) => instruksi.instruksi_kd === item.instruksi_kd
              );
              return (
                <div key={item.instruksi_kd} className="hover:bg-gray-200 ">
                  <div>{namedInstruksi?.instruksi_nama}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-4 ">
          <h1 className="font-semibold">Catatan</h1>
          <div className="font-medium">{disposisi.catatan}</div>
        </div>

        <h1 className="font-semibold my-2">Disposisi kepada</h1>
        {disposisi.tbl_disposisi_detail?.map((detail) => {
          const result = fungsi.find(
            (item) => item.fungsi_kd === detail.detail_fungsi_kd
          );
          return (
            <div
              key={detail.disposisi_detail_kd}
              className={cn(
                user_fungsi_kd === detail.detail_fungsi_kd &&
                  "font-semibold bg-gray-200/65 shadow-sm rounded-md h-[42px] items-center z-10",
                "flex flex-row  p-1 w-full",
                detail.detail_perhatian === "Y"
                  ? detail.berita_status_pengerjaan === "Y"
                    ? "hover:bg-blue-100"
                    : "hover:bg-red-100"
                  : detail.detail_terima === "Y"
                  ? "hover:bg-blue-100"
                  : "hover:bg-red-100"
              )}
            >
              <div className="w-3/4">{result?.nama_fungsi}</div>
              <div className="w-1/4">
                {detail.detail_perhatian === "Y" ? (
                  <LucideCheckCheck
                    className={
                      detail.berita_status_pengerjaan !== "Y"
                        ? "text-red-500"
                        : "text-blue-500"
                    }
                  />
                ) : (
                  <LucideCheck
                    className={
                      detail.detail_terima === "Y"
                        ? "text-blue-500"
                        : "text-gray-500"
                    }
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full flex flex-col mt-2">
        <h1 className="font-semibold my-2">Korespondensi</h1>
        <div className="flex flex-col gap-2 justify-center w-full">
          {korespondensi?.map((item) => {
            return (
              <div
                key={item.korespondensi_id}
                className="flex flex-row gap-1 w-full"
              >
                <div className="w-1/8">
                  <FaUserClock />
                </div>
                <div className="bg-gray-50 px-1 rounded-sm grow flex flex-col justify-between">
                  <div className="flex flex-row gap-1">{item.user_nama}</div>
                  {item.korespondensi_komentar !== "" && (
                    <div>{item.korespondensi_komentar}</div>
                  )}
                  <div className="text-sm self-end text-gray-500">
                    {formatDateAgo(item.korespondensi_datetime)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LembarDisposisi;
