import Sidebar from "../components/Sidebar"
import BottomNav from "../components/BottomNav"

function Layout({ children }) {
  return (
    <div className="bg-bg min-h-screen text-white">

      {/* Sidebar always */}
      <Sidebar />

      {/* Main content */}
      <main className="lg:ml-64 px-4 pt-6 pb-24 max-w-6xl mx-auto">
        {children}
      </main>

      {/* Bottom nav always (mobile) */}
      <BottomNav />

    </div>
  )
}

export default Layout
