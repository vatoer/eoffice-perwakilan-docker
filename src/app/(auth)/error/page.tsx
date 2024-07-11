import { auth, signOut } from "@auth/auth";
import UserSignout from "@/components/user-signout";

const ErrorPage = async () => {
  const session = await auth();
  if (!session) {
    return (
      <div>
        <h1>Error Page</h1>
        <p>User not found</p>
        <form
          action={async (formData) => {
            "use server";
            await signOut();
          }}
        >
          <button type="submit">Sign out</button>
        </form>
      </div>
    );
  }

  console.log("[ERROR PAGE] user: ", session);
  return (
    <div>
      <h1>Error Page</h1>
      <p>please signout and signin again</p>
      <UserSignout />
    </div>
  );
};

export default ErrorPage;
