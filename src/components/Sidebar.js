import { Home, Users, Calendar, Bot, User } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

const navItems = [
  { label: "Home", icon: Home, path: "/Dashboard" },
  { label: "Clients", icon: Users, path: "/clients" },
  { label: "Calendar", icon: Calendar, path: "/calendar" },
  { label: "AI", icon: Bot, path: "/ai" },
  { label: "Profile", icon: User, path: "/profile" }
]

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside
      className="hidden lg:flex fixed left-0 top-0 h-full w-64
                 bg-gradient-to-b from-[#0b0f14] to-[#0d1117]
                 border-r border-white/5 flex-col"
    >
      {/* LOGO */}
      <div className="px-6 py-6 border-b border-white/5">
        <h1 className="font-heading text-xl tracking-wide">
          VOID<span className="text-brandGreen">EX</span>
        </h1>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map(item => {
          const active =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path)

          return (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={active}
              onClick={() => navigate(item.path)}
            />
          )
        })}
      </nav>


    </aside>
  )
}

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        group relative flex items-center gap-3 px-4 py-3
        rounded-xl cursor-pointer transition-all duration-200
        ${
          active
            ? "bg-brandGreen/10 text-brandGreen"
            : "text-muted hover:bg-white/5 hover:text-white"
        }
      `}
    >
      {/* ACTIVE INDICATOR */}
      {active && (
        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-brandGreen" />
      )}

      {/* ICON */}
      <div
        className={`
          h-9 w-9 rounded-lg flex items-center justify-center
          ${
            active
              ? "bg-brandGreen/20 text-brandGreen"
              : "bg-white/5 group-hover:bg-white/10"
          }
        `}
      >
        <Icon size={18} />
      </div>

      {/* LABEL */}
      <span className="font-medium tracking-wide">
        {label}
      </span>
    </div>
  )
}

export default Sidebar
