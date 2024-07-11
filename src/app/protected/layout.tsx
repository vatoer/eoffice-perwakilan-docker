const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  //return <AuthContextProvider>{children}</AuthContextProvider>;
  return <>{children}</>;
};

export default ProtectedLayout;
