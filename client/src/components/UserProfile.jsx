import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/UserContextpProvider"
import css from "../css/userForm.module.css"
import axios from "axios"
import { LOGOUT_URL, USER_URL } from "../constants/endPoint"

export const UserProfile = ({ setIsSignup, fullScreen}) => {
  const { user, setUser, role } = useContext(UserContext)
  const [orders,setOrders] = useState([])
  const navigate = useNavigate()
  useEffect(()=>{
    user && getOrders()
  },[user])

  const getOrders = async () =>{
    try{
    const {data} = await axios.get(`${USER_URL}get-orders`)
    console.log("haha",data);
    }catch(error){

    }
  }
  return (
    <div className={`${fullScreen? "mycontainer": css.form}`}>
      {user&&<p>name: {user.name}</p>}
      {user&&<p>email: {user.email}</p>}
      {role == "admin" && (
        <p
          onClick={() => navigate("/admin")}
          className="w-[50px] cursor-pointer font-bold text-blue-600 hover:underline active:text-blue-500"
        >
          {role}
        </p>
      )}
      <div>
    {orders.length&& 
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
              <td className="px-4 py-2 text-center">sum of: {orders[0].totalAmount}$</td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>}


      </div>
      <button
        className={css.logoutBtn}
        onClick={async () => {
          await axios.get(LOGOUT_URL)
          setUser(null)
          setIsSignup(false)
          location.reload()
        }}
      >
        logout
      </button>
    </div>
  )
}
