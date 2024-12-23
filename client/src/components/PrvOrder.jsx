import React, { useState } from "react"

export const PrvOrder = (props) => {
  const [seeOrder, setSeeOrder] = useState(false)
  return (
    <div>
      <div
        className={`rounded-lg border border-gray-300 bg-white shadow-md ${"h-full w-full p-4"} mx-auto mt-4 overflow-auto overflow-x-hidden`}
      >
        <div onClick={() => setSeeOrder((p) => !p)}>
          <span>{props.orderDate}</span>
          <span>{props.status}</span>
        </div>
        <table className={`min-w-full bg-white ${seeOrder ? " " : "hidden"}`}>
          <thead>
            <tr className="bg-gray-200 text-xs uppercase leading-normal text-gray-600 md:text-sm">
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-center">Quantity</th>
              <th className="px-4 py-2 text-center">Price</th>
            </tr>
          </thead>
          <tbody className="text-xs font-light text-gray-600 md:text-sm">
            {props.cart.map((item, index) => (
              <tr
                key={props.orderDate + index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="whitespace-nowrap px-4 py-2 text-left">
                  {index + 1}
                </td>
                <td className="px-4 py-2 text-left">{item.title}</td>
                <td className="px-4 py-2 text-left">{item.category}</td>
                <td className="px-4 py-2 text-center">{item.quantity}</td>
                <td className="px-4 py-2 text-center">{item.price}$</td>
              </tr>
            ))}
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="whitespace-nowrap px-4 py-2 text-left"></td>
              <td className="px-4 py-2 text-left"></td>
              <td className="px-4 py-2 text-left"></td>
              <td className="px-4 py-2 text-center"></td>
              <td className="px-4 py-2 text-center">
                sum of: {props.totalAmount}$
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
