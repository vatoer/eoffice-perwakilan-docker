import { FILESERVER_URL, JWT } from ".";

// Ignore SSL certificate verification (for development purposes only)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
export const downloadFile = async (inout: string, file: string) => {
  const maxRetries = 10;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const response = await fetch(
        `${FILESERVER_URL}/index.php?inout=${inout}&file=${file}`,
        {
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
        }
      );

      // Log the response status and headers for debugging
      //console.log("downloadFile Response Status:", response.status);
      //console.log("Response Headers:", response.headers);

      // Check if the response is OK (status in the range 200-299)
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const blob = await response.blob();
      return blob;
    } catch (err) {
      const error = err as Error;
      console.error("Fetch error:", error);
      attempts++;
      console.log("Retrying... Attempt", attempts);
      if (attempts >= maxRetries) {
        throw new Error("Max retries reached. " + error.message);
      }
    }
  }
};
