const USERNAME = process.env.FILESERVER_USERNAME;
const PASSWORD = process.env.FILESERVER_PASSWORD;
const FILESERVER_URL = process.env.FILESERVER_URL;
export const getJwt = async (): Promise<string> => {
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
