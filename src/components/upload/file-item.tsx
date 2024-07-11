import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  cancelUpload,
  formatFileSize,
  uploadChunkedFile,
  uploadFile,
} from "@/utils/upload";
import { CancelTokenSource } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface FileItemProps {
  file: File;
  onDelete?: (file: File) => Promise<void> | void;
  fired?: boolean;
  onCompleted?: (file: File) => void;
}

const FileItem = ({ file, onDelete, fired, onCompleted }: FileItemProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const cancelTokenSourcesRef = useRef<CancelTokenSource[]>([]);
  const [randomString, setRandomString] = useState(
    Math.random().toString(36).substring(2, 15)
  );
  const CHUNK_SIZE = 512 * 1024; // 512 KB

  useEffect(() => {
    if (fired && isComplete) {
      //toast.success("file uploaded " + file.name);
      return;
    }

    if (fired) {
      handleUpload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fired]);

  const handleCancel = () => {
    cancelUpload(cancelTokenSourcesRef);
    setIsUploading(false);
    console.log("cancel upload");
  };

  const handleDelete = useCallback(async () => {
    if (onDelete) {
      try {
        await onDelete(file);
      } catch (error) {
        console.error("Failed to delete file:", error);
      }
    }
  }, [file, onDelete]);

  const populateCancelTokenSources = useCallback((token: CancelTokenSource) => {
    cancelTokenSourcesRef.current.push(token);
  }, []);

  const handleUpload = useCallback(async () => {
    console.log("handleUpload");
    if (isComplete) return;
    setIsUploading(true);
    if (file.size > 512 * 1024) {
      await uploadChunkedFile(
        file,
        CHUNK_SIZE,
        randomString,
        populateCancelTokenSources,
        setProgress,
        setIsUploading
      );
    } else {
      await uploadFile(file, onCompleted, setProgress, setIsUploading);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, isComplete]);

  return (
    <div className="flex flex-col w-full gap-2 p-1">
      <div className="flex gap-2">
        <Progress className="w-full h-8" value={progress ? progress : 0} />
        {progress == 100 ? (
          <Button onClick={handleDelete}>Delete</Button>
        ) : (
          <>
            <Button onClick={handleUpload} disabled={isUploading}>
              Upload
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </>
        )}
      </div>
      <span>{file.name}</span>
      <span>{formatFileSize(file.size)}</span>
    </div>
  );
};

export default FileItem;
