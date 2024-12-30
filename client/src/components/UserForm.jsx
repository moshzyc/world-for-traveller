import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/UserContextpProvider"
import css from "../css/userForm.module.css"
import { LOGIN_URL, SIGNUP_URL } from "../constants/endPoint"
import axios from "axios"

export default function UserForm({ isSignup, formChenge }) {
  const [error, setError] = useState("")
  const { user, setUser } = useContext(UserContext)
  const [formValues, setFormValues] = useState({
    name: " ",
    email: " ",
    password: " ",
    birthDate: " ",
  })

  useEffect(() => {
    if (!isSignup) {
      setFormValues({
        email: "",
        password: "",
      })
    }
  }, [isSignup])

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isSignup) {
        await axios.post(SIGNUP_URL, formValues)
        formChenge((p) => !p)
      } else {
        const { data } = await axios.post(LOGIN_URL, formValues)
        setUser(data)
        location.reload()
      }
    } catch (error) {
      alert(error)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-72 max-w-md rounded-lg bg-white shadow-lg"
    >
      {error && (
        <span className="mb-4 block w-full rounded-md bg-red-500 p-2 text-center text-white">
          {error}
        </span>
      )}

      <div className="space-y-4">
        {isSignup && (
          <div className="space-y-2">
            <label htmlFor="name" className="block font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-[#2e7d32] focus:outline-none focus:ring-1 focus:ring-[#2e7d32]"
              id="name"
              type="text"
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  [e.target.name]: e.target.value.replace("@", ""),
                })
              }
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block font-medium text-gray-700">
            Email
          </label>
          <input
            name="email"
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-[#2e7d32] focus:outline-none focus:ring-1 focus:ring-[#2e7d32]"
            id="email"
            type="email"
            onChange={(e) =>
              setFormValues({
                ...formValues,
                [e.target.name]: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block font-medium text-gray-700">
            Password
          </label>
          <input
            name="password"
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-[#2e7d32] focus:outline-none focus:ring-1 focus:ring-[#2e7d32]"
            id="password"
            type="password"
            onChange={(e) =>
              setFormValues({
                ...formValues,
                [e.target.name]: e.target.value,
              })
            }
          />
        </div>

        {isSignup && (
          <div className="space-y-2">
            <label
              htmlFor="birthDate"
              className="block font-medium text-gray-700"
            >
              Birth Date
            </label>
            <input
              name="birthDate"
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-[#2e7d32] focus:outline-none focus:ring-1 focus:ring-[#2e7d32]"
              id="birthDate"
              type="date"
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-[#2e7d32] py-2 text-white transition-colors hover:bg-[#1b5e20]"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p
          className="cursor-pointer text-center text-[#2e7d32] hover:underline"
          onClick={() => formChenge((p) => !p)}
        >
          {isSignup ? "Already have an account? Login" : "Create new account"}
        </p>
      </div>
    </form>
  )
}
