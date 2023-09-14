import React, { useRef } from "react"
import useAuth from "../hooks/useAuth"

export default function LoginForm() {
  const accountRef = useRef()
  const passwordRef = useRef()
  const handleLogin = () => {
    const account = accountRef.current.value
    const password = passwordRef.current.value
    login(account, password)
  }
  const { login } = useAuth()

  return (
    <div className="container">
      <div className="loginForm py-2">
        <h1 className="text-center">Login</h1>
        <div className="input-group mb-2">
          <span className="input-group-text w-25">Account</span>
          <input type="text" className="form-control" ref={accountRef} />
        </div>
        <div className="input-group mb-2">
          <span className="input-group-text w-25">Password</span>
          <input type="password" className="form-control" ref={passwordRef} />
        </div>
        <div className="d-flex">
          <div
            className="btn btn-primary btn-login m-auto"
            onClick={handleLogin}
          >
            Login
          </div>
        </div>
      </div>
    </div>
  )
}
