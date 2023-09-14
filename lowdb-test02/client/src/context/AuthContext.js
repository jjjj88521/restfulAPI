import React, { createContext, useState } from "react"

export const AuthContext = createContext({ user: undefined })

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined)

  // 設置登入 token 狀態
  const [token, setToken] = useState(undefined)

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}
