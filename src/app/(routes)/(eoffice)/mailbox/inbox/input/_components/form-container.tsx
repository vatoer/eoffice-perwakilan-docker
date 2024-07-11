"use client";
import { useSearchParams } from "next/navigation";
import FormInbox from "./form";
const FormContainer = () => {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  return <FormInbox editId={editId} />;
};

export default FormContainer;
