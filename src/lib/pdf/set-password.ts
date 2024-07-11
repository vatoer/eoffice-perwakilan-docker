import { EncKey, getActiveKeyForToday } from "@/data/password-key";
import { OperationResult } from "@/types/operation-result";
import { setPasswordForPDF } from "@/utils/pdf-utils";

// Centralized error messages for easier maintenance
const ERROR_MESSAGES = {
  noActiveKey: "No active encryption key found for today.",
  setPasswordFailure: "Failed to set password for PDF.",
};

export const setPassword = async (
  inputFilePath: string,
  outputFilePath: string
): Promise<OperationResult<string>> => {
  try {
    const encryptionKey: EncKey | null = await getActiveKeyForToday();

    if (!encryptionKey) {
      console.error(ERROR_MESSAGES.noActiveKey);
      return { success: false, error: ERROR_MESSAGES.noActiveKey };
    }

    const { user_key: userPassword, admin_key: ownerPassword } = encryptionKey;

    await setPasswordForPDF(
      inputFilePath,
      outputFilePath,
      userPassword,
      ownerPassword
    );
    return {
      success: true,
      data: outputFilePath,
      message: "Password set successfully.",
    };
  } catch (error) {
    console.error(ERROR_MESSAGES.setPasswordFailure, error);
    return { success: false, error: ERROR_MESSAGES.setPasswordFailure };
  }
};
