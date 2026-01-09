import { Bell } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { DataContext } from "../context/DataContext"

function Header() {
  const navigate = useNavigate()
  const data = useContext(DataContext)

  const unreadCount =
    data?.notifications?.filter(n => !n.read).length || 0

  return (
    <div className="flex items-center justify-between mb-6">

      {/* LEFT: TITLE */}
      <div>
        <h1 className="text-2xl font-heading">
          Welcome back to VOIDEX
        </h1>
        <p className="text-muted">
          Here's your overview for today
        </p>
      </div>

      {/* RIGHT: BELL */}
      <div
        className="relative cursor-pointer"
        onClick={() => navigate("/notifications")}
      >
        <Bell className="text-muted hover:text-white" size={22} />

        {unreadCount > 0 && (
          <span
            className="absolute -top-2 -right-2
                       bg-brandGreen text-xs
                       h-5 w-5 rounded-full
                       flex items-center justify-center"
          >
            {unreadCount}
          </span>
        )}
      </div>
    </div>
  )
}

export default Header
