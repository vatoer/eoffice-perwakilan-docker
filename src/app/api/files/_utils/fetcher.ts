export const FILESERVER_URL = process.env.FILESERVER_URL;
const USERNAME = process.env.FILESERVER_USERNAME;
const PASSWORD = process.env.FILESERVER_PASSWORD;

// Ignore SSL certificate verification (for development purposes only)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const login = async () => {
  const jsonBody = JSON.stringify({ USERNAME, PASSWORD });
  console.log(jsonBody);

  const response = await fetch(`${FILESERVER_URL}/login.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });

  // Log the response status and headers for debugging
  console.log("Response Status:", response.status);
  console.log("Response Headers:", response.headers);

  // Check if the response is OK (status in the range 200-299)
  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }
  const data = await response.json();
  return data.jwt;
};

export const downloadFile = async (inout: string, file: string) => {
  //const jwt = await login(); // get jwt token from login cuman g bs, jadi hardcode aja
  // harus login dulu baru dapatin jwt token
  // jwt token ini nantinya di set di env
  // TODO : benerin login dulu
  const jwt = process.env.FILESERVER_JWT;
  //console.log("jwt", jwt);

  const maxRetries = 10;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const response = await fetch(
        `${FILESERVER_URL}/index.php?inout=${inout}&file=${file}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
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
