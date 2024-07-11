"use client";
import useFileStore from "@/hooks/use-file-store";
import { useSearchParams } from "next/navigation";
import FormOutbox from "./form";
interface Option {
  value: string;
  label: string;
}
const FormContainer = () => {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const fileUrl = useFileStore((state) => state.fileUrl);
  return <FormOutbox editId={editId} />;
};

export default FormContainer;
