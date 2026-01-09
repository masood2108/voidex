import { BrowserRouter, Routes, Route } from "react-router-dom"
import AuthProvider from "./context/AuthContext"
import DataProvider from "./context/DataContext"
import ProtectedRoute from "./components/ProtectedRoute"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Onboarding from "./pages/Onboarding"
import Dashboard from "./pages/Dashboard"
import Notifications from "./pages/Notifications"
import Clients from "./pages/Clients"
import ClientDetails from "./pages/ClientDetails"
import ProjectDetails from "./pages/ProjectDetails"

/* ✅ ADD THIS */
import Calendar from "./pages/Calender"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:clientId" element={<ClientDetails />} />
            <Route
              path="/clients/:clientId/projects/:projectId"
              element={<ProjectDetails />}
            />

            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* ✅ ADD THIS ROUTE */}
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Login />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
