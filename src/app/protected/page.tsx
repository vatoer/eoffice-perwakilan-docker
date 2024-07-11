import { UserButton } from "@/components/user/user-button";

export default function ProtectedPage() {
  return (
    <div>
      <h1>Protected Page</h1>
      <p>This page is protected.</p>
      <UserButton />
    </div>
  );
}
