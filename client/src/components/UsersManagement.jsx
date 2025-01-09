import React, { useState, useEffect } from "react"
import axios from "axios"
import { GET_ALL_USERS_URL, ADMIN_UPDATE_USER_URL } from "../constants/endPoint"
import { adminStyles } from "../pages/Admin"

// קומפוננטת ניהול משתמשים - מאפשרת למנהל לערוך ולנהל משתמשים //
export const UsersManagement = ({ searchQuery }) => {
  // ניהול מצב //
  const [users, setUsers] = useState([]) // רשימת משתמשים
  const [selectedUser, setSelectedUser] = useState(null) // משתמש נבחר לעריכה
  const [adminPassword, setAdminPassword] = useState("") // סיסמת מנהל לאימות
  const [error, setError] = useState("") // הודעות שגיאה
  const [success, setSuccess] = useState("") // הודעות הצלחה
  const [editFields, setEditFields] = useState({
    // שדות בעריכה
    name: false,
    email: false,
    phone: false,
  })

  // טעינת משתמשים בטעינה ראשונית //
  useEffect(() => {
    fetchUsers()
  }, [])

  // פונקציה לטעינת רשימת המשתמשים //
  const fetchUsers = async () => {
    try {
      const response = await axios.get(GET_ALL_USERS_URL)
      setUsers(response.data)
    } catch (error) {
      setError("Failed to fetch users")
    }
  }

  // פונקציה לבחירת משתמש לעריכה //
  const handleEdit = (user) => {
    setSelectedUser(user)
    setError("")
    setSuccess("")
  }

  // פונקציה לעדכון פרטי משתמש //
  const handleUpdate = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      // הכנת נתוני העדכון //
      const updates = {
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone,
        role: selectedUser.role,
      }

      // שליחת העדכון לשרת //
      await axios.put(ADMIN_UPDATE_USER_URL, {
        userId: selectedUser._id,
        updates,
        adminPassword,
      })

      // איפוס הטופס לאחר הצלחה //
      setSuccess("User updated successfully")
      fetchUsers()
      setSelectedUser(null)
      setAdminPassword("")
      setEditFields({ name: false, email: false, phone: false })
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update user")
    }
  }

  // סינון משתמשים לפי חיפוש //
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery?.toLowerCase())
  )

  return (
    <div className="p-6">
      {/* הודעות שגיאה והצלחה */}
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}

      {selectedUser ? (
        // טופס עריכת משתמש //
        <form onSubmit={handleUpdate} className="space-y-4">
          {/* שדות עריכה - שם, אימייל, טלפון */}
          <div>
            <label className={adminStyles.label}>Name</label>
            {editFields.name ? (
              // מצב עריכת שם //
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className={adminStyles.input}
                  value={selectedUser.name}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setEditFields({ ...editFields, name: false })}
                  className="text-red-600 hover:text-red-900"
                >
                  Cancel
                </button>
              </div>
            ) : (
              // תצוגת שם //
              <div className="flex items-center gap-2">
                <p className="py-2">{selectedUser.name}</p>
                <button
                  type="button"
                  onClick={() => setEditFields({ ...editFields, name: true })}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
          <div>
            <label className={adminStyles.label}>Email</label>
            {editFields.email ? (
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  className={adminStyles.input}
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setEditFields({ ...editFields, email: false })}
                  className="text-red-600 hover:text-red-900"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="py-2">{selectedUser.email}</p>
                <button
                  type="button"
                  onClick={() => setEditFields({ ...editFields, email: true })}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
          <div>
            <label className={adminStyles.label}>Phone</label>
            {editFields.phone ? (
              <div className="flex items-center gap-2">
                <input
                  type="tel"
                  className={adminStyles.input}
                  value={selectedUser.phone}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, phone: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setEditFields({ ...editFields, phone: false })}
                  className="text-red-600 hover:text-red-900"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="py-2">{selectedUser.phone}</p>
                <button
                  type="button"
                  onClick={() => setEditFields({ ...editFields, phone: true })}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </button>
              </div>
            )}
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
        // טבלת משתמשים //
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* כותרות הטבלה */}
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
            {/* תוכן הטבלה */}
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
          {/* הודעה כשאין תוצאות חיפוש */}
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
