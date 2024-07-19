"use client";
import { Button } from "@/components/ui/button";
import { Inbox } from "@/data/inbox";
import { useModeDisposisi } from "@/hooks/use-mode-disposisi";
import { useInbox } from "@/hooks/use-surat";
import { useSuratId } from "@/hooks/use-surat-id";
import { useToggleFormDispo } from "@/hooks/use-toggle-form-dispo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect } from "react";

interface MailActionsProps {
  className?: string;
  user_fungsi_kd?: number;
}

const MailActions = ({ className, user_fungsi_kd }: MailActionsProps) => {
  const { onOff, toggle } = useToggleFormDispo();
  const { suratId } = useSuratId();
  const { inbox: inboxStore } = useInbox();
  const { modeDisposisi, setModeDisposisi } = useModeDisposisi();

  const handleClickEditDisposisi = () => {
    setModeDisposisi("U");
    console.log("Edit disposisi");
  };

  useEffect(() => {
    const initialMode = setInitialMode(inboxStore, user_fungsi_kd);
    setModeDisposisi(initialMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suratId, inboxStore, user_fungsi_kd]);

  return (
    <div
      className={cn(
        "hidden md:flex",
        "mail-action-Buttons flex flex-row gap-2 p-2",
        className && className
      )}
    >
      {
        // hanya jika sudah disposisi atau fungsi sama dengan fungsi disposisi
        (user_fungsi_kd === inboxStore?.berita_fungsi_disposisi ||
          inboxStore?.disposisi_kd) && (
          <Button onClick={toggle}>Lembar Dispo</Button>
        )
      }
      {
        // jika sudah pernah disposisi bisa diedit oleh fungsi yang sama dengan pendisposisi
        inboxStore?.berita_fungsi_disposisi === user_fungsi_kd &&
          inboxStore?.disposisi_kd &&
          modeDisposisi !== "U" && (
            <Button
              variant="outline"
              onClick={handleClickEditDisposisi}
              type="button"
            >
              Edit Disposisi
            </Button>
          )
      }
      {modeDisposisi === "U" && (
        <Button
          variant="outline"
          onClick={() => {
            setModeDisposisi("NA");
            console.log("Batal Edit");
          }}
        >
          Batal Edit
        </Button>
      )}
      {
        // Only the user who input the mail can edit it
        user_fungsi_kd === inboxStore?.berita_input_user && (
          <Link href={`/mailbox/inbox/input?edit=${suratId}`}>
            <Button variant="outline">Edit</Button>
          </Link>
        )
      }
    </div>
  );
};

function setInitialMode(inbox: Inbox | null, user_fungsi_kd?: number) {
  if (!inbox || !user_fungsi_kd) return "NA";
  if (inbox.berita_fungsi_disposisi === user_fungsi_kd && !inbox.disposisi_kd) {
    return "C";
  }
  if (inbox.disposisi_kd) {
    return "R";
  }
  return "NA";
}

export default MailActions;
