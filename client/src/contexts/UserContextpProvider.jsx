import { createContext, useEffect, useState } from "react"
import axios from "axios"
import { GET_INFO_URL } from "../constants/endPoint"
axios.defaults.withCredentials = true
export const UserContext = createContext()

export const UserContextpProvider = ({ children }) => {
  let [user, setUser] = useState(null)
  const [admin, setAdmin] = useState("")
  
  useEffect(() => {
    console.log(user)
  }, [user])

  useEffect(() => {
    checkIfUserConnected()
  }, [])
  const checkIfUserConnected = async () => {
    try {
      const { data } = await axios.get(GET_INFO_URL)
      setUser(data)
      setAdmin(data.role)
    } catch (error) {}
  }

  return (
    <UserContext.Provider
      value={{
        user,
        admin,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
