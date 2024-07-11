"use client";
import { Button } from "@/components/ui/button";
import { useInboxDisposisiStore } from "@/hooks/use-disposisi-store";
import { useSuratId } from "@/hooks/use-surat-id";
import { useToggleFormDispo } from "@/hooks/use-toggle-form-dispo";
import { CheckCircleIcon, LucideMailOpen } from "lucide-react";
import { useEffect } from "react";
import {
  handleTelahDilaksanakan,
  handleTerimaDisposisi,
} from "./lembar-disposisi";

interface MailActionsProps {}

const MailActions = ({}: MailActionsProps) => {
  const { setShow, toggle } = useToggleFormDispo();
  const { setSuratId, suratId } = useSuratId();
  const { inboxDisposisi, setInboxDisposisi } = useInboxDisposisiStore(
    (state) => state
  );

  useEffect(() => {
    console.log("inboxDisposisi berubah g?", inboxDisposisi);
  }, [inboxDisposisi]);

  if (!suratId || !inboxDisposisi) {
    return;
  }

  const telahDilaksanakan = async () => {
    const tl = await handleTelahDilaksanakan({ text: "Telah dilaksanakan" });
  };

  const terimaDisposisi = async () => {
    const terima = await handleTerimaDisposisi({ text: "Telah diterima" });
  };

  return (
    <div className="mail-action-Buttons flex flex-row gap-2 p-2">
      <Button onClick={toggle}>Lembar Dispo</Button>

      {(!inboxDisposisi.terima || inboxDisposisi.terima !== "Y") && (
        <Button
          className="mail-action-Button gap-2"
          onClick={() => terimaDisposisi()}
          variant={"outline"}
        >
          <LucideMailOpen />
          <span>Terima</span>
        </Button>
      )}

      {inboxDisposisi.detail_perhatian === "Y" &&
        (!inboxDisposisi.berita_status_pengerjaan ||
          inboxDisposisi.berita_status_pengerjaan !== "Y") && (
          <Button
            className=" gap-2"
            variant={"outline"}
            onClick={() => telahDilaksanakan()}
          >
            <CheckCircleIcon />
            <span>Selesai</span>
          </Button>
        )}
    </div>
  );
};

export default MailActions;
