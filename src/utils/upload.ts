import axios, { CancelToken, CancelTokenSource } from "axios";
import { error } from "console";
import { MutableRefObject } from "react";

interface MyError extends Error {
  message: string;
}

export function formatFileSize(number: number) {
  if (number < 1024) {
    return `${number} bytes`;
  } else if (number >= 1024 && number < 1048576) {
    return `${(number / 1024).toFixed(1)} KB`;
  } else if (number >= 1048576) {
    return `${(number / 1048576).toFixed(1)} MB`;
  }
}

export async function uploadFile(
  file: File,
  onCompleted: ((file: File) => void) | undefined,
  setProgress: React.Dispatch<React.SetStateAction<number>>,
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("filename", file.name);

  try {
    const response = await axios.post("/api/upload", formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      },
    });

    setIsUploading(false);
    if (onCompleted) onCompleted(file);
  } catch (error) {
    setIsUploading(false);
    console.error("Upload failed:", error);
  }
}

// Function to create and store a cancel token source
const createCancelToken = () => {
  const source = axios.CancelToken.source();
  //cancelTokenSourcesRef.current.push(source);
  return source;
};

export async function uploadChunkedFile(
  file: File,
  chunkSize: number,
  randomString: string,
  onStart: (token: CancelTokenSource) => void,
  setProgress: React.Dispatch<React.SetStateAction<number>>,
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>
) {
  let start = 0;
  const totalChunks = Math.ceil(file.size / chunkSize);
  const cancelTokenSource = createCancelToken();
  onStart(cancelTokenSource);

  try {
    for (let idx = 0; start < file.size; start += chunkSize, idx++) {
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      console.log("Uploading chunk:", idx);
      // Implement upload individual chunk logic here
      await uploadIndividualChunk(
        file,
        chunk,
        idx,
        randomString,
        cancelTokenSource
      );

      // Calculate and update progress
      const progress = Math.round(((idx + 1) * 100) / totalChunks);
      setProgress(progress);
    }

    console.log("All chunks uploaded");

    // Implement merge chunks logic here
    // Check if upload is canceled before merging chunks
    if (!cancelTokenSource.token.reason) {
      const mergedChunk = await mergeChunks(file, totalChunks, randomString);
      if (mergedChunk.error) {
        throw new Error(mergedChunk.error);
      }
      setProgress(100);
    } else {
      console.log("Upload canceled. Skipping merge.");
      // TODO: notify server to delete chunked files that are already uploaded
      // delete chunked files that are already uploaded
      // reset progress
      setProgress(0);
    }
    //setIsComplete(true);
  } catch (error: any) {}
}

const uploadIndividualChunk = async (
  file: File,
  chunk: Blob,
  idx: number,
  randomString: string,
  cancelToken: CancelTokenSource
) => {
  const formData = new FormData();
  formData.append("filename", file.name);
  formData.append("randomString", randomString);
  formData.append("chunk", chunk);
  formData.append("currentChunk", idx.toString());

  try {
    const response = await axios.post("/api/upload/chunk", formData, {
      cancelToken: cancelToken.token,
    });
    return response;
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("Chunk upload request canceled:", error.message);
    } else {
      throw error;
    }
  }
};

const mergeChunks = async (
  file: File,
  totalChunks: number,
  randomString: string
) => {
  const formData = new FormData();
  formData.append("filename", file.name);
  formData.append("totalChunks", totalChunks.toString());
  formData.append("randomString", randomString);

  try {
    const cancelTokenSource = createCancelToken();
    const response = await axios.post("/api/upload/merge", formData, {
      cancelToken: cancelTokenSource.token,
    });
    console.log("Merge complete:", file.name);
    return {
      filename: file.name,
      error: null,
    };
  } catch (error: any) {
    //const error = err as MyError; // Type assertion to ensure 'err' is treated as an Error
    if (!axios.isCancel(error)) {
      console.error("Merge request failed:", error.message);
    } else {
      console.log("Merge request canceled:", error.message);
    }
    return {
      filename: file.name,
      error: error.message,
    };
  }
};

export function cancelUpload(
  CancelTokenSources: MutableRefObject<CancelTokenSource[]>
) {
  CancelTokenSources.current.forEach((source, index) => {
    source.cancel(`Operation canceled by the user for request ${index + 1}.`);
  });
  // TODO : cancel upload
  // notify server to delete chunked files that are already uploaded
  //axios.delete("/api/upload/delete", { data: { filename: file.name } });
  console.log("cancel upload");
}
