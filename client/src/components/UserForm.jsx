import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/UserContextpProvider"
import css from "../css/userForm.module.css"
import { LOGIN_URL, SIGNUP_URL } from "../constants/endPoint"
import axios from "axios"

export default function UserForm({ isSignup, formChenge, onLoginSuccess }) {
  const [error, setError] = useState("")
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState({
    name: " ",
    email: " ",
    password: " ",
    phone: " ",
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

  const validateAge = (birthDate) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--
    }

    return age >= 10
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isSignup) {
        if (!validateAge(formValues.birthDate)) {
          setError("You must be at least 10 years old to sign up")
          return
        }
        await axios.post(SIGNUP_URL, formValues)
        formChenge((p) => !p)
      } else {
        const { data } = await axios.post(LOGIN_URL, formValues)
        setUser(data)
        if (onLoginSuccess) {
          onLoginSuccess()
        } else {
          window.location.reload()
        }
      }
    } catch (error) {
      if (error.response?.status === 401 && error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError("An error occurred. Please try again.")
      }
    }
  }

  const getMaxDate = () => {
    const date = new Date()
    date.setFullYear(date.getFullYear() - 10)
    return date.toISOString().split("T")[0]
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`mx-auto w-72 max-w-md rounded-lg bg-white p-4 shadow-lg ${
        !onLoginSuccess ? "max-h-[90vh] overflow-y-auto" : ""
      }`}
    >
      {error && (
        <div className="mb-4 rounded-md bg-red-100 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
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
              autoComplete="name"
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
            autoComplete="email"
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
            autoComplete={isSignup ? "new-password" : "current-password"}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                [e.target.name]: e.target.value,
              })
            }
          />
        </div>

        {isSignup && (
          <>
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
                max={getMaxDate()}
                autoComplete="bday"
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    [e.target.name]: e.target.value,
                  })
                }
                required={isSignup}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                name="phone"
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-[#2e7d32] focus:outline-none focus:ring-1 focus:ring-[#2e7d32]"
                id="phone"
                type="tel"
                autoComplete="tel"
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    [e.target.name]: e.target.value,
                  })
                }
                required={isSignup}
              />
            </div>
          </>
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
