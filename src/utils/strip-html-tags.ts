export function stripHtmlTags(input: string | null | undefined): string {
  if (!input) return "";
  return input.replace(/<[^>]*>?/gm, "");
}

/**
 * Sanitizes the input string by removing all HTML tags.
 * @param input The input string potentially containing HTML tags.
 * @returns The sanitized string with HTML tags removed.
 */
function sanitizeInput(input: string): string {
  // Regular expression to match HTML tags
  const regex = /<[^>]*>/g;
  // Replace HTML tags with an empty string
  return input.replace(regex, "");
}

// // Example usage
// const unsafeString = '<script>alert("Hello")</script>Some text';
// const safeString = sanitizeInput(unsafeString);
// console.log(safeString); // Output: Some text
