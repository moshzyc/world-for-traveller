import React, { useState, useEffect } from "react"
import axios from "axios"
import { GET_ALL_USERS_URL, ADMIN_UPDATE_USER_URL } from "../constants/endPoint"
import { adminStyles } from "../pages/Admin"

export const UsersManagement = ({ searchQuery }) => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [adminPassword, setAdminPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get(GET_ALL_USERS_URL)
      setUsers(response.data)
    } catch (error) {
      setError("Failed to fetch users")
    }
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setError("")
    setSuccess("")
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const updates = {
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
      }

      await axios.put(ADMIN_UPDATE_USER_URL, {
        userId: selectedUser._id,
        updates,
        adminPassword,
      })

      setSuccess("User updated successfully")
      fetchUsers()
      setSelectedUser(null)
      setAdminPassword("")
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update user")
    }
  }

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery?.toLowerCase())
  )

  return (
    <div className="p-6">
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}

      {selectedUser ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className={adminStyles.label}>Name</label>
            <input
              type="text"
              className={adminStyles.input}
              value={selectedUser.name}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className={adminStyles.label}>Email</label>
            <input
              type="email"
              className={adminStyles.input}
              value={selectedUser.email}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className={adminStyles.label}>Role</label>
            <select
              className={adminStyles.select}
              value={selectedUser.role}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className={adminStyles.label}>Your Admin Password</label>
            <input
              type="password"
              className={adminStyles.input}
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className={adminStyles.button}>
              Update User
            </button>
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className={adminStyles.deleteButton}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="whitespace-nowrap px-6 py-4">{user.name}</td>
                  <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                  <td className="whitespace-nowrap px-6 py-4">{user.phone}</td>
                  <td className="whitespace-nowrap px-6 py-4">{user.role}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <p className="py-4 text-center text-gray-500">
              No users found matching your search.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
