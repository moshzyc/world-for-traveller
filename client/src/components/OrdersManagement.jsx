import React, { useState, useEffect } from "react"
import axios from "axios"
import {
  GET_ALL_ORDERS_URL,
  UPDATE_ORDER_STATUS_URL,
} from "../constants/endPoint"
import { adminStyles } from "../pages/Admin"

// פונקציה לעיצוב פריטי ההזמנה //
const formatItems = (cart) => {
  return cart.map((item, index) => (
    <div key={index} className="mb-1 last:mb-0">
      <span className="font-medium">{item.productId.title}</span>
      <span className="text-gray-500"> × {item.quantity}</span>
    </div>
  ))
}

export const OrdersManagement = () => {
  // ניהול מצב ההזמנות וסטטוס הטעינה //
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")

  // טעינת ההזמנות בעת טעינת הדף //
  useEffect(() => {
    fetchOrders()
  }, [])

  // פונקציה לטעינת ההזמנות מהשרת //
  const fetchOrders = async () => {
    try {
      const response = await axios.get(GET_ALL_ORDERS_URL, {
        withCredentials: true,
      })
      setOrders(response.data)
      console.log(response.data)
    } catch (err) {
      setError("Failed to fetch orders")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // פונקציה לעדכון סטטוס ההזמנה //
  const updateOrderStatus = async (userId, orderId, newStatus) => {
    try {
      await axios.put(
        UPDATE_ORDER_STATUS_URL,
        { userId, orderId, status: newStatus },
        { withCredentials: true }
      )
      fetchOrders() // רענון ההזמנות לאחר העדכון
    } catch (err) {
      console.error(err)
      alert(
        "Failed to update order status: " + err.response?.data?.message ||
          err.message
      )
    }
  }

  // סינון ההזמנות לפי סטטוס //
  const filteredOrders = orders.filter((order) =>
    statusFilter === "all" ? true : order.status === statusFilter
  )

  // תצוגת טעינה ושגיאה //
  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="p-4">
      {/* כותרת וסינון */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-gray-700">Orders List</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Filter by status:</label>
          <select
            className={`${adminStyles.select} w-full sm:w-auto`}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* תצוגה למובייל */}
      <div className="block lg:hidden">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="mb-4 rounded-lg border bg-white p-4 shadow"
          >
            <div className="mb-2 flex justify-between">
              <div className="font-medium">{order.userName}</div>
              <div className="text-sm text-gray-500">
                {new Date(order.orderDate).toLocaleDateString()}
              </div>
            </div>
            <div className="mb-2 text-sm text-gray-500">{order.userEmail}</div>
            <div className="mb-2">{formatItems(order.cart)}</div>
            <div className="mb-2 font-medium">
              Total: {order.totalAmount} ILS
            </div>
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  order.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : order.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.status}
              </span>
            </div>
            <select
              className={`${adminStyles.select} w-full`}
              value={order.status}
              onChange={(e) =>
                updateOrderStatus(order.userId, order._id, e.target.value)
              }
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        ))}
      </div>

      {/* תצוגת טבלה למסך רחב */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {/* כותרות הטבלה */}
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Order Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {/* שורות הטבלה */}
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                {/* תאריך הזמנה */}
                <td className="whitespace-nowrap px-6 py-4">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                {/* פרטי לקוח */}
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {order.userName}
                  </div>
                  <div className="text-sm text-gray-500">{order.userEmail}</div>
                  <div className="text-sm text-gray-900">{order.userPhone}</div>
                  <div className="text-sm text-gray-500">{order.deliveryAddress}</div>
                </td>
                {/* פריטים */}
                <td className="px-6 py-4">
                  <div className="max-w-xs text-sm">
                    {formatItems(order.cart)}
                  </div>
                </td>
                {/* סכום כולל */}
                <td className="whitespace-nowrap px-6 py-4">
                  {order.totalAmount} ILS
                </td>
                {/* סטטוס הזמנה */}
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                {/* פעולות */}
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <select
                    className={adminStyles.select}
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.userId, order._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
