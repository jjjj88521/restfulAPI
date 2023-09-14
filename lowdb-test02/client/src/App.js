import React, { useContext } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import LoginForm from "./pages/LoginForm"
import { AuthProvider, AuthContext } from "./context/AuthContext"

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routing />
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

const Routing = () => {
  const { user } = useContext(AuthContext)

  return (
    <Routes>
      <Route path="/" element={user ? <Home /> : <LoginForm />} />
    </Routes>
  )
}

export default App
