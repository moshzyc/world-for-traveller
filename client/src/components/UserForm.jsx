import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts/UserContextpProvider'
import css from '../css/userForm.module.css'
import { LOGIN_URL, SIGNUP_URL } from '../constants/endPoint'
import axios from 'axios'

export default function UserForm({ isSignup, formChenge}) {
  const [error, setError] = useState("")
  // const navigate = useNavigate()
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
        console.log(formValues)
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
    <form onSubmit={onSubmit} className={css.form}>
      {error && <span className="w-full rounded-md bg-red-500">{error}</span>}
      <p
        className="cursor-pointer text-center text-blue-700 hover:underline"
        onClick={() => formChenge((p)=>!p)}
      >
        {isSignup?"to login":"create account"}
      </p>
      {/* name */}

      {isSignup && (
        <div>
          <label htmlFor="name" className="mr-2">
            name:
          </label>
          <input
            name="name"
            className={css.inputs}
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

      {/* email */}
      <div>
        <label htmlFor="email" className="mr-2">
          email:
        </label>
        <input
          name="email"
          className={css.inputs}
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
      {/* password */}
      <div>
        <label htmlFor="password" className="mr-2 w-1/4 text-left">
          password:
        </label>
        <input
          name="password"
          className={css.inputs}
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

      {/* age */}
      {isSignup && (
        <div>
          <label htmlFor="age" className="mr-2 w-1/4 text-left">
           birth-date:
          </label>
          <input
            name="birthDate"
            className={css.inputs}
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
      <button type="submit" className={css.btn}>
        {isSignup ? "signup" : "login"}
      </button>
    </form>
  )
}

