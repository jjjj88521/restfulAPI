import React, { createContext, useState, useEffect } from "react"
import jwt from "jwt-decode"
import axios from "axios"

export const AuthContext = createContext({ user: undefined })

export const AuthProvider = ({ children }) => {
  const appKey = "reactReviewLoginToken"
  const [user, setUser] = useState(undefined)
  const API_STATUS = "http://127.0.0.1:3005/api/users/status"

  // 設置登入 token 狀態
  const [token, setToken] = useState(localStorage.getItem(appKey))

  useEffect(() => {
    // if (token) {
    //   setUser(jwt(token))
    // }
    let checkLoginStatus = async () => {
      if (token) {
        try {
          const result = await axios.post(
            API_STATUS,
            {},
            {
              headers: {
                authorization: token,
              },
            }
          )
          // console.log(result)
          if (result.status === 200) {
            setToken(result.data.token)
            setUser(jwt(token))
          } else {
            alert(result.data.message)
            localStorage.removeItem(appKey)
            setToken(null)
            setUser(undefined)
          }
        } catch (error) {
          console.log(error)
          localStorage.removeItem(appKey)
          setToken(null)
          setUser(undefined)
        }
      }
    }
    checkLoginStatus()
  }, [token])

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}
