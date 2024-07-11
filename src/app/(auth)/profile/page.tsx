import UserSignout from "@/components/user-signout";
import { auth } from "../auth";

const ProfilePage = async () => {
  const session = await auth();
  return (
    <div>
      <h1>Profile Page</h1>
      <p>Welcome {session?.user.name}!</p>
      <UserSignout />
    </div>
  );
};

export default ProfilePage;
