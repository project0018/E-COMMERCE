import { useState, useEffect } from "react";
import { Label, Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function UserLists() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array ensures this runs only once on mount.

  return (
    <div className="p-4 w-full">
      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <Table hoverable className="w-full border-collapse">
            <Table.Head className="bg-transparent">
              <Table.HeadCell className="bg-gray-600 text-white text-xl">Date Created</Table.HeadCell>
              <Table.HeadCell className="bg-gray-600 text-white text-xl">User Image</Table.HeadCell>
              <Table.HeadCell className="bg-gray-600 text-white text-xl">User Name</Table.HeadCell>
              <Table.HeadCell className="bg-gray-600 text-white text-xl">Seller / Buyer</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y border border-b-3">
              {users.map((user) => (
                <Table.Row key={user._id} className="bg-transparent">
                  <Table.Cell className="text-black text-2xl">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/detail/${user._id}`}>
                    <img
                      src={user.profilePicture || "https://via.placeholder.com/150"}
                      alt={user.username}
                      className="w-16 h-16 object-cover rounded-full border border-gray-300"
                    />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/detail/${user._id}`} className="text-2xl text-black flex items-center">
                      {user.username}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {user.role === "seller" ? (
                      <Label className="text-2xl">Seller</Label>
                    ) : (
                      <Label className="text-2xl">Buyer</Label>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <p>No Users Yet!</p>
      )}
    </div>
  );
}
