import React, { useState, useEffect } from "react"
import axios from "axios"
import {
  GET_ALL_ORDERS_URL,
  UPDATE_ORDER_STATUS_URL,
} from "../constants/endPoint"
import { adminStyles } from "../pages/Admin"

const formatItems = (cart) => {
  return cart.map((item, index) => (
    <div key={index} className="mb-1 last:mb-0">
      <span className="font-medium">{item.productId.title}</span>
      <span className="text-gray-500"> × {item.quantity}</span>
    </div>
  ))
}

export const OrdersManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.get(GET_ALL_ORDERS_URL, {
        withCredentials: true,
      })
      setOrders(response.data)
    } catch (err) {
      setError("Failed to fetch orders")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (userId, orderId, newStatus) => {
    try {
      await axios.put(
        UPDATE_ORDER_STATUS_URL,
        {
          userId,
          orderId,
          status: newStatus,
        },
        {
          withCredentials: true,
        }
      )
      fetchOrders() // Refresh orders after update
    } catch (err) {
      console.error(err)
      alert(
        "Failed to update order status: " + err.response?.data?.message ||
          err.message
      )
    }
  }

  const filteredOrders = orders.filter((order) =>
    statusFilter === "all" ? true : order.status === statusFilter
  )

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">Orders List</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Filter by status:</label>
          <select
            className={adminStyles.select}
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
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
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
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td className="whitespace-nowrap px-6 py-4">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {order.userName}
                  </div>
                  <div className="text-sm text-gray-500">{order.userEmail}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs text-sm">
                    {formatItems(order.cart)}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {order.totalAmount} ILS
                </td>
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
