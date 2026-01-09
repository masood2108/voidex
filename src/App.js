import { BrowserRouter, Routes, Route } from "react-router-dom"

import AuthProvider from "./context/AuthContext"
import DataProvider from "./context/DataContext"
import ProtectedRoute from "./components/ProtectedRoute"

/* PAGES */
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Onboarding from "./pages/Onboarding"
import Dashboard from "./pages/Dashboard"
import Notifications from "./pages/Notifications"
import Clients from "./pages/Clients"
import ClientDetails from "./pages/ClientDetails"
import ProjectDetails from "./pages/ProjectDetails"
import Calendar from "./pages/Calender"

/* ✅ LAYOUT */
import Layout from "./layouts/Layout"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>

            {/* ================= PUBLIC ================= */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ================= PROTECTED + LAYOUT ================= */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Calendar />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/clients"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Clients />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/clients/:clientId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ClientDetails />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/clients/:clientId/projects/:projectId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProjectDetails />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Notifications />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />

            {/* ================= FALLBACK ================= */}
            <Route path="*" element={<Login />} />

          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
