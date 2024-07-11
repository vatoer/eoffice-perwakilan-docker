import { dbEdispo } from "@/lib/db-edispo";
import { exec } from "child_process";
import fs from "fs";
import * as path from "path";
import { quote } from "shell-quote";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Sanitize input to prevent command injection.
 * @param input - The input string to sanitize.
 * @returns The sanitized input string.
 */
function sanitizeInput(input: string): string {
  return quote([input]);
}

/**
 * Sanitize input file path to prevent command injection.
 * @param input - The input file path to sanitize.
 * @returns The sanitized input file path.
 */
function sanitizeInputFilePath(input: string): string {
  // Escape special characters in the file path
  // return input.replace(/(["'$`\\])/g, "\\$1");
  return `"${input}"`;
}

/**
 * Generate the command to set a user and owner password on a PDF file using qpdf.
 * @param inputPath - The path to the input PDF file.
 * @param outputPath - The path to the output PDF file.
 * @param userPassword - The user password to set on the PDF file.
 * @param ownerPassword - The owner password to set on the PDF file.
 * @returns The command string to be executed.
 */
function generateQpdfCommand(
  inputPath: string,
  outputPath: string,
  userPassword: string,
  ownerPassword: string
): string {
  const sanitizedInputPath = sanitizeInputFilePath(inputPath);
  const sanitizedOutputPath = sanitizeInputFilePath(outputPath);
  const sanitizedUserPassword = sanitizeInput(userPassword);
  const sanitizedOwnerPassword = sanitizeInput(ownerPassword);

  return `qpdf --encrypt ${sanitizedUserPassword} ${sanitizedOwnerPassword} 256 -- ${sanitizedInputPath} ${sanitizedOutputPath}`;
}

/**
 * Execute the qpdf command to set a password on a PDF file.
 * @param command - The command to execute.
 * @throws Will throw an error if the command execution fails.
 */
async function executeQpdfCommand(command: string): Promise<void> {
  await execAsync(command);
}

/**
 * Get the output file path based on the input file path.
 * @param inputPath - The path to the input PDF file.
 * @returns The path to the output PDF file.
 */
export function getOutputFilePath(inputPath: string): string {
  const ext = path.extname(inputPath);
  const base = path.basename(inputPath, ext);
  const dir = path.dirname(inputPath);
  return path.join(dir, `${base}_protected${ext}`);
}

export const fixPdf = async (inputPath: string) => {
  try {
    // Define a temporary file path for the repaired PDF
    const tempPath = `${inputPath}.temp`;

    // Create a copy of the original PDF file
    fs.copyFileSync(inputPath, tempPath);

    // Execute qpdf command to repair the PDF file
    const fixCommand = `qpdf --qdf --normalize-content=y "${tempPath}" "${inputPath}"`;
    await execAsync(fixCommand);

    // Check if the repair was successful
    if (fs.existsSync(inputPath)) {
      // Remove the temporary file
      fs.unlinkSync(tempPath);
      console.log("PDF file repaired successfully.");
    } else {
      console.error("Failed to repair the PDF file.");
    }
  } catch (error) {
    console.error("An error occurred while fixing the PDF file:", error);
  }
};

/**
 * Set a user and owner password for a given PDF file.
 * @param inputPath - The path to the input PDF file.
 * @param outputPath - The path to the output PDF file.
 * @param userPassword - The user password to set on the PDF file.
 * @param ownerPassword - The owner password to set on the PDF file.
 * @returns The path to the output PDF file.
 */
export async function setPasswordForPDF(
  inputPath: string,
  outputPath: string,
  userPassword: string,
  ownerPassword: string
): Promise<string> {
  const command = generateQpdfCommand(
    inputPath,
    outputPath,
    userPassword,
    ownerPassword
  );

  console.log(`Setting passwords for PDF: ${outputPath}`);
  console.log(`Command: ${command}`);

  try {
    await executeQpdfCommand(command);
    console.log(`Passwords set successfully for PDF: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error("Error setting passwords for PDF:", error);
    throw new Error(
      `Failed to set passwords for PDF: ${(error as Error).message}`
    );
  }
}
