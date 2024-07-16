const SettingGeneralPage = () => {
  const excludedKeywords = ["SECRET", "TOKEN", "KEY", "PASSWORD", "JWT"];

  const envVariables = Object.keys(process.env).reduce((obj, key) => {
    if (excludedKeywords.some((keyword) => key.includes(keyword))) {
      (obj as { [key: string]: string })[key] = "********";
    } else {
      (obj as { [key: string]: string })[key] = process.env[key]!;
    }
    return obj;
  }, {} as { [key: string]: string });

  return (
    <div>
      <h1>Settings General Page</h1>
      <pre>{JSON.stringify(envVariables, null, 2)}</pre>
    </div>
  );
};

export default SettingGeneralPage;
