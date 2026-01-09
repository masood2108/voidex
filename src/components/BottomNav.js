import { Home, Users, Calendar, Bot, User } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

const navItems = [
  { icon: Home, path: "/" },
  { icon: Users, path: "/clients" },
  { icon: Calendar, path: "/calendar" },
  { icon: Bot, path: "/ai" },
  { icon: User, path: "/profile" }
]

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50
                 bg-gradient-to-t from-[#0d1117] to-[#0b0f14]
                 border-t border-white/5
                 px-6 py-3"
    >
      <div className="flex justify-between items-center">
        {navItems.map(item => {
          const active =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path)

          return (
            <NavItem
              key={item.path}
              icon={item.icon}
              active={active}
              onClick={() => navigate(item.path)}
            />
          )
        })}
      </div>
    </div>
  )
}

function NavItem({ icon: Icon, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className="relative flex items-center justify-center w-14"
    >
      {/* ACTIVE INDICATOR DOT */}
      {active && (
        <span className="absolute -top-2 h-1.5 w-1.5 rounded-full bg-brandGreen" />
      )}

      {/* ICON CONTAINER */}
      <div
        className={`
          h-11 w-11 rounded-xl flex items-center justify-center
          transition-all duration-200
          ${
            active
              ? "bg-brandGreen/20 text-green scale-110"
              : "bg-white/5 text-muted hover:text-white"
          }
        `}
      >
        <Icon size={20} />
      </div>
    </div>
  )
}

export default BottomNav
