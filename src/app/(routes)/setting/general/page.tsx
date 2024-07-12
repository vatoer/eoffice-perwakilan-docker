const SettingGeneralPage = () => {
  const envVariables = Object.keys(process.env)
    .filter((key) => !key.startsWith("SECRET_"))
    .reduce((obj, key) => {
      (obj as { [key: string]: string })[key] = process.env[key]!;
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
