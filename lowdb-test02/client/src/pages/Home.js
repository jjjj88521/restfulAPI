import React, { useContext } from "react"
import { AuthProvider, AuthContext } from "../context/AuthContext"
import useAuth from "../hooks/useAuth"

export default function Home() {
  const { user } = useContext(AuthContext)
  const { logout } = useAuth()
  return (
    <AuthProvider>
      <div className="Home container">
        <div className="d-flex py-3">
          <div className="head d-flex flex-column pe-3">
            <img
              src={user.head}
              alt="img_here"
              className="rounded-circle mb-3"
            />
            <div className="btn btn-primary" onClick={logout}>
              Logout
            </div>
          </div>
          <div className="ps-3">
            <h1>{user.name}</h1>
            <div className="fs-3">{user.account}</div>
            <p>{user.mail}</p>
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}
