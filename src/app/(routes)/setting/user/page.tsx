import { getUsers } from "@/data/user";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/table";

const UserPage = async () => {
  const users = await getUsers();

  return (
    <div>
      <div>
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
};

export default UserPage;
