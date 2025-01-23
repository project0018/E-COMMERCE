import { useState, useEffect } from "react";
import { Table } from "flowbite-react";
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
          <table className="table-auto w-full border-collapse border border-gray-300 text-center">
            <thead>
              <tr className="bg-gray-600 text-white text-xl">
                <th className="px-4 py-2">Date Created</th>
                <th className="px-4 py-2">User Image</th>
                <th className="px-4 py-2">User Name</th>
                <th className="px-4 py-2">Seller / Buyer</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user._id} className="bg-white">
                  <td className="px-4 py-2 text-black text-2xl">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <Link to={`/detail/${user._id}`}>
                      <img
                        src={user.profilePicture || "https://via.placeholder.com/150"}
                        alt={user.username}
                        className="w-16 h-16 object-cover rounded-full border border-gray-300"
                      />
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-2xl text-black">
                    <Link to={`/detail/${user._id}`} className="flex items-center justify-center">
                      {user.username}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-2xl">
                    {user.role === "seller" ? "Seller" : "Buyer"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No Users Yet!</p>
      )}
    </div>
  );
}
