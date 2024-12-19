import React, { useContext } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"

const CartTable = ({ fullScreen }) => {
  const { cart, addAnother, minusAmount, deletItem, cartSum } = useContext(
    StoreContext)

    


  return (
    <div
      className={`rounded-lg border border-gray-300 bg-white shadow-md ${
        fullScreen
          ? "h-full w-full p-4"
          : "h-[300px] max-w-md overflow-auto p-2"
      } mx-auto mt-4 overflow-auto overflow-x-hidden`}
    >
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-xs uppercase leading-normal text-gray-600 md:text-sm">
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-center">Quantity</th>
            <th className="px-4 py-2 text-center">Price</th>
            {fullScreen && <th>Delete</th>}
          </tr>
        </thead>
        <tbody className="text-xs font-light text-gray-600 md:text-sm">
          {cart.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="whitespace-nowrap px-4 py-2 text-left">
                {index + 1}
              </td>
              <td className="px-4 py-2 text-left">{item.title}</td>
              <td className="px-4 py-2 text-left">{item.category}</td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => {
                    addAnother(index + 1)
                  }}
                  className="mr-1 border border-black pl-[3px] pr-[3px] hover:bg-gray-300 active:scale-[0.98]"
                >
                  +
                </button>
                {item.quantity}
                <button
                  onClick={() => minusAmount(index + 1)}
                  className="ml-1 border border-black pl-[3px] pr-[3px] hover:bg-gray-300 active:scale-[0.98]"
                >
                  -
                </button>
              </td>
              <td className="px-4 py-2 text-center">{item.price}$</td>
              {fullScreen && (
                <td>
                  <button
                    onClick={() => deletItem(index + 1)}
                    className="redBtn"
                  >
                    delete
                  </button>
                </td>
              )}
            </tr>
          ))}

          {fullScreen && (
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="whitespace-nowrap px-4 py-2 text-left"></td>
              <td className="px-4 py-2 text-left"></td>
              <td className="px-4 py-2 text-left"></td>
              <td className="px-4 py-2 text-center"></td>
              <td className="px-4 py-2 text-center">sum of: {cartSum}$</td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default CartTable
