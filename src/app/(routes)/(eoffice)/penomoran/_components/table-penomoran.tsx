"use client";
import { getDaftarNomor } from "@/actions/penomoran";
import { DokumenKeluar } from "@/zod/schemas/penomoran";
import { useEffect, useState } from "react";
import PenomoranListItem from "./penomoran-list-item";

interface TablePenomoranProps {
  jenis: string | null;
  lastUpdate?: number;
}
const TablePenomoran = ({ jenis, lastUpdate }: TablePenomoranProps) => {
  const [data, setData] = useState<DokumenKeluar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jenis) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getDaftarNomor(jenis);
        if (response.success) {
          setData(response.data);
        }
        //const data = await response.
        //setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jenis, lastUpdate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (data.length === 0) {
    return <div>no data</div>;
  }

  return (
    <div className="flex flex-col w-full gap-2 p-2 text-slate-500">
      <h1 className="font-semibold text-xl px-2 ">Daftar Penomoran</h1>
      <div className="flex flex-col w-full">
        <div className="overflow-x-auto w-full">
          <div className="w-full">
            {data.map((dokumen, index) => (
              <PenomoranListItem key={index} mail={dokumen} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablePenomoran;
