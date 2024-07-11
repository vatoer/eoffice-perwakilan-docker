import { cn } from "@/lib/utils";
import { DokumenKeluar } from "@/zod/schemas/penomoran";

interface DokumenKeluarPreviewProps {
  dokumen?: DokumenKeluar | null;
  className?: string;
}
export const DokumenKeluarPreview = ({
  dokumen,
  className,
}: DokumenKeluarPreviewProps) => {
  if (!dokumen) {
    return null;
  }

  if (!dokumen.nomor) {
    return null;
  }

  if (dokumen.nomor !== "xx") {
    return null;
  }

  return (
    <div className={cn(className && className)}>
      <div className="flex flex-row w-full">
        <div className="w-1/3 md:w-1/6 font-semibold text-gray-600">Nomor</div>
        <div className="w-full font-semibold text-gray-700">
          {dokumen.nomor}
        </div>
      </div>
      <div className="flex flex-row w-full">
        <div className="w-1/3 md:w-1/6 font-semibold text-gray-600">
          Perihal
        </div>
        <div className="w-full font-semibold text-gray-700">
          {dokumen.perihal}
        </div>
      </div>
    </div>
  );
};
