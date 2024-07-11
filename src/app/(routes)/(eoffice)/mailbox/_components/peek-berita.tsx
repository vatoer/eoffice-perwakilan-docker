import { Berita } from "@/zod/schemas/berita";

export interface BeritaBasicInfo {
  perihal_berita: string;
  arsip_kd: string;
  berita_kd: string;
}

interface PeekBeritaProps {
  berita: BeritaBasicInfo | Berita | null;
}
export const PeekBerita = ({ berita }: PeekBeritaProps) => {
  if (!berita) return null;
  return (
    <div className="font-light mt-4">
      <div className="flex flex-col w-full gap-1">
        <div className="flex">
          <div className="text-left font-semibold align-top flex-1">
            {berita.perihal_berita}
          </div>
        </div>
        <div className="flex gap-1">
          <div className="text-left align-top w-1/3">Agenda</div>
          <div className="text-left align-top">:</div>
          <div className="text-left align-top flex-1">{berita.arsip_kd}</div>
        </div>
        <div className="flex gap-1">
          <div className="text-left align-top w-1/3">Nomor Dokumen</div>
          <div className="text-left align-top">:</div>
          <div className="text-left align-top flex-1">{berita.berita_kd}</div>
        </div>
      </div>
    </div>
  );
};

export default PeekBerita;
