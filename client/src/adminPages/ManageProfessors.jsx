import { useState, useEffect } from "react";
import axios from "axios";
import AdminNav from "./AdminNav";

export default function ManageProfessors() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/admin/professors').then(({ data }) => {
      setUsers(data);
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });
  }, []);

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/admin/professors/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 mt-5">
      <AdminNav />
      <div className="flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg w-full max-w-5xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Manage Users</h1>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="py-3 px-6 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-700">{user.name}</td>
                      <td className="py-4 px-6 text-gray-700">{user.email}</td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          className="inline-flex gap-2 py-2 px-6 rounded-full bg-primary text-white"
                          onClick={() => deleteUser(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center text-gray-500 mt-6">
                  No professors found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

