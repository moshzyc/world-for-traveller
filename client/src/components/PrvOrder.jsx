import React, { useState } from "react"

// קומפוננטת רשימת הזמנות - מציגה את כל ההזמנות של המשתמש עם אפשרות סינון //
export const OrdersList = ({ orders }) => {
  // ניהול מצב פילטר סטטוס ההזמנות //
  const [statusFilter, setStatusFilter] = useState("all")

  // סינון ההזמנות לפי סטטוס //
  const filteredOrders = orders.filter((order) =>
    statusFilter === "all" ? true : order.status === statusFilter
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">Order History</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Filter by status:</label>
          <select
            className="rounded-lg border border-gray-300 p-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
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

      {filteredOrders.length > 0 ? (
        filteredOrders.map((order, index) => (
          <PrvOrder key={order.orderDate + index} {...order} />
        ))
      ) : (
        <div className="rounded-lg bg-white p-8 text-center shadow-md">
          <div className="mb-4 text-4xl">🛍️</div>
          <h3 className="mb-2 text-lg font-medium text-gray-800">
            No {statusFilter !== "all" ? statusFilter : ""} Orders Found
          </h3>
          <p className="text-gray-600">
            {statusFilter === "all"
              ? "When you make your first purchase, it will appear here."
              : `You don't have any ${statusFilter} orders yet.`}
          </p>
        </div>
      )}
    </div>
  )
}

// קומפוננטת הזמנה בודדת - מציגה את פרטי ההזמנה //
export const PrvOrder = (props) => {
  // מצב הצגת/הסתרת פרטי ההזמנה //
  const [seeOrder, setSeeOrder] = useState(false)

  // פונקציה לעיצוב התאריך בפורמט קריא //
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // פונקציה לקבלת צבע הסטטוס //
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800" // צהוב לממתין
      case "completed":
        return "bg-[#e8f5e9] text-[#2e7d32]" // ירוק להושלם
      case "cancelled":
        return "bg-red-100 text-red-800" // אדום לבוטל
      default:
        return "bg-gray-100 text-gray-800" // אפור לברירת מחדל
    }
  }

  return (
    <div className="mb-4">
      <div className="rounded-lg border border-gray-200 bg-white shadow-md">
        {/* Order Header */}
        <div
          onClick={() => setSeeOrder((p) => !p)}
          className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-gray-50"
        >
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{formatDate(props.orderDate)}</span>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(props.status)}`}
            >
              {props.status}
            </span>
          </div>
          <span className="text-xl text-[#2e7d32]">{seeOrder ? "−" : "+"}</span>
        </div>

        {/* Order Details Table */}
        <div
          className={`border-t border-gray-200 ${seeOrder ? "block" : "hidden"}`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#f0f7f0] text-sm">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    #
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Category
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.cart.map((item, index) => (
                  <tr
                    key={props.orderDate + index}
                    className="border-t border-gray-100 text-sm transition-colors hover:bg-[#f0f7f0]"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.title}</td>
                    <td className="px-4 py-3 text-gray-600">{item.category}</td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {item.price} ILS
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="border-t border-gray-200 bg-[#f0f7f0] font-medium">
                  <td
                    colSpan="4"
                    className="px-4 py-3 text-right text-gray-700"
                  >
                    Total Amount:
                  </td>
                  <td className="px-4 py-3 text-center text-[#2e7d32]">
                    {props.totalAmount} ILS
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
