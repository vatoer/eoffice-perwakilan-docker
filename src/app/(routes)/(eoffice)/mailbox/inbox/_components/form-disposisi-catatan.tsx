import React, { useRef } from "react";

interface DisposisiCatatanProps {
  onCatatanChange: (value: string) => void;
}

const DisposisiCatatan: React.FC<DisposisiCatatanProps> = ({
  onCatatanChange,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleOnBlur = () => {
    if (textareaRef.current) {
      console.log("handleOnBlur");
      console.log("catatan", textareaRef.current.value);
      onCatatanChange(textareaRef.current.value); // Send the value to the parent component
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-2 w-full">
        <h3 className="font-semibold">Catatan</h3>
        <textarea
          id="disposisi-catatan"
          rows={4}
          className="w-full p-2"
          ref={textareaRef}
          onBlur={handleOnBlur}
        />
      </div>
    </div>
  );
};

export default DisposisiCatatan;
