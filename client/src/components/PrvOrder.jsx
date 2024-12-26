import React, { useState } from "react"

export const PrvOrder = (props) => {
  const [seeOrder, setSeeOrder] = useState(false)

  // Format the date to be more readable
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-[#e8f5e9] text-[#2e7d32]"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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
                      ${item.price}
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
                    ${props.totalAmount}
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
