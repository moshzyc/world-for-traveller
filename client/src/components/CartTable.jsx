
import React, { useContext } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"

const CartTable = ({ fullScreen, seeCart }) => {
  const { cart, addAnother, minusAmount, deletItem, cartSum } =
    useContext(StoreContext)

  // Calculate max-height for non-fullScreen mode (5 items + header + total)
  const compactRowHeight = 56 // height for each row in pixels
  const maxCompactHeight = compactRowHeight * 7 // 5 items + header + total row

  return (
    <div
      className={`rounded-lg border border-[#2e7d32] bg-white shadow-md ${
        fullScreen
          ? "h-full w-full p-4"
          : `w-[300px] ${cart.length > 5 ? "overflow-auto" : ""}`
      } mx-auto mt-4 overflow-x-hidden`}
      style={
        !fullScreen
          ? { maxHeight: cart.length > 5 ? maxCompactHeight : "auto" }
          : {}
      }
    >
      <table className="w-full bg-white">
        <thead className="sticky top-0 z-10 bg-white">
          <tr className="bg-[#e8f5e9] text-xs uppercase leading-normal text-[#2e7d32] md:text-sm">
            {fullScreen && <th className="px-4 py-2 text-right">#</th>}
            <th className="px-4 py-2 text-right">Title</th>
            {fullScreen && <th className="px-4 py-2 text-right">Category</th>}
            <th
              className={`${fullScreen ? "px-4" : "w-[90px] px-1"} py-2 text-center`}
            >
              Qty
            </th>
            <th
              className={`${fullScreen ? "px-4" : "w-14 px-1"} py-2 text-center`}
            >
              Price
            </th>
            {fullScreen && <th className="px-4 py-2 text-center">Delete</th>}
          </tr>
        </thead>
        <tbody
          className={`text-gray-600 ${fullScreen ? "text-sm" : "text-xs"}`}
        >
          {cart.map((item, index) => (
            <tr
              key={index}
              className={`border-b border-[#e8f5e9] transition-colors duration-200 hover:bg-[#f0f7f0] ${
                !fullScreen ? "h-14" : ""
              }`}
            >
              {fullScreen && (
                <td className="whitespace-nowrap px-4 py-2 text-right">
                  {index + 1}
                </td>
              )}
              <td className={`${fullScreen ? "px-4" : "px-2"} py-3 text-right`}>
                {item.title}
              </td>
              {fullScreen && (
                <td className="px-4 py-2 text-right">{item.category}</td>
              )}
              <td
                className={`${fullScreen ? "px-4" : "px-1"} whitespace-nowrap py-3 text-center`}
              >
                <button
                  onClick={() => addAnother(index + 1)}
                  className={`${fullScreen ? "mr-1" : "mr-0.5"} rounded border border-[#2e7d32] px-1.5 text-[#2e7d32] transition-colors duration-200 hover:bg-[#e8f5e9] active:scale-[0.98]`}
                >
                  +
                </button>
                <span className={`${fullScreen ? "mx-2" : "mx-1"}`}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => minusAmount(index + 1)}
                  className={`${fullScreen ? "ml-1" : "ml-0.5"} rounded border border-[#2e7d32] px-1.5 text-[#2e7d32] transition-colors duration-200 hover:bg-[#e8f5e9] active:scale-[0.98]`}
                >
                  -
                </button>
              </td>
              <td
                className={`${fullScreen ? "px-4" : "px-1"} py-3 text-center`}
              >
                {item.price} {fullScreen && "ILS"}
              </td>
              {fullScreen && (
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => deletItem(index + 1)}
                    className="rounded bg-red-500 px-3 py-1 text-white transition-colors duration-200 hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}

          {cart.length > 0 && (
            <tr className="sticky bottom-0 bg-[#e8f5e9] font-semibold text-[#2e7d32]">
              {fullScreen && <td className="px-4 py-2"></td>}
              <td className={`${fullScreen ? "px-4" : "px-2"} py-3 text-right`}>
                Total:
              </td>
              {fullScreen && <td className="px-4 py-2"></td>}
              <td
                className={`${fullScreen ? "px-4" : "px-1"} py-3 text-center`}
              ></td>
              <td
                className={`${fullScreen ? "px-4" : "px-1"} py-3 text-center`}
              >
                {cartSum} {fullScreen && "ILS"}
              </td>
              {fullScreen && <td></td>}
            </tr>
          )}
        </tbody>
      </table>

      {cart.length === 0 && (
        <div className="py-4 text-center text-[#558b2f]">
          Your cart is empty
        </div>
      )}
    </div>
  )
}

export default CartTable
