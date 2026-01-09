import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) return null   // ⛔ DO NOT REDIRECT YET

  if (!user) return <Navigate to="/login" replace />

  return children
}

export default ProtectedRoute
