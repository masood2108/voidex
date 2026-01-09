import { useEffect, useState } from "react"
import { auth, db } from "../firebase"
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
  getDocs
} from "firebase/firestore"
import {
  Bell,
  DollarSign,
  FileText,
  Folder,
  CheckCircle,
  Calendar,
  Check,
  Trash
} from "lucide-react"
import { useNavigate } from "react-router-dom"

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState("all")
  const navigate = useNavigate()
  const user = auth.currentUser

  /* ================= REALTIME ================= */
  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, "users", user.uid, "notifications"),
      orderBy("createdAt", "desc")
    )

    return onSnapshot(q, snap => {
      setNotifications(
        snap.docs.map(d => ({ id: d.id, ...d.data() }))
      )
    })
  }, [user])

  /* ================= ACTIONS ================= */
  const markAsRead = async (id) => {
    await updateDoc(
      doc(db, "users", user.uid, "notifications", id),
      { read: true }
    )
  }

  const markAllAsRead = async () => {
    const snap = await getDocs(
      collection(db, "users", user.uid, "notifications")
    )
    snap.forEach(d => updateDoc(d.ref, { read: true }))
  }

  /* ================= HELPERS ================= */
  const iconMap = {
    payment: {
      icon: <DollarSign size={18} className="text-red-400" />,
      bg: "bg-red-500/10"
    },
    task: {
      icon: <Folder size={18} className="text-yellow-400" />,
      bg: "bg-yellow-500/10"
    },
    meeting: {
      icon: <Calendar size={18} className="text-blue-400" />,
      bg: "bg-blue-500/10"
    },
    completed: {
      icon: <Check size={18} className="text-green-400" />,
      bg: "bg-green-500/10"
    },
    delete: {
      icon: <Trash size={18} className="text-red-400" />,
      bg: "bg-red-500/10"
    },
    project: {
      icon: <FileText size={18} className="text-brandBlue" />,
      bg: "bg-brandBlue/10"
    }
  }

  const timeAgo = (ts) => {
    if (!ts) return ""
    const diff = Date.now() - ts.toDate().getTime()
    const h = Math.floor(diff / (1000 * 60 * 60))
    return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`
  }

  const filtered =
    filter === "unread"
      ? notifications.filter(n => !n.read)
      : notifications

  const unreadCount = notifications.filter(n => !n.read).length

  /* ================= UI ================= */
  return (
    <div className="bg-bg min-h-screen text-white px-4 pb-24">
      <div className="pt-6 max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-muted hover:text-white transition"
            >
              ← Back
            </button>

            <div>
              <h1 className="text-2xl font-heading">Notifications</h1>
              <p className="text-muted text-sm">
                Tasks, meetings & payments
              </p>
            </div>
          </div>

          <div className="relative">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brandGreen text-xs
                h-5 w-5 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex items-center gap-3 mb-6">
          {["all", "unread"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                filter === f
                  ? "bg-brandGreen/10 text-brandGreen"
                  : "text-muted hover:text-white"
              }`}
            >
              {f === "all" ? "All" : "Unread"}
            </button>
          ))}

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="ml-auto text-sm text-muted hover:text-white transition"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <p className="text-muted text-center text-sm">
              No notifications
            </p>
          )}

          {filtered.map(n => {
            const meta = iconMap[n.type] || iconMap.project

            return (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`card p-5 cursor-pointer transition
                  hover:bg-white/[0.04]
                  ${!n.read ? "border-l-4 border-brandGreen" : ""}
                `}
              >
                <div className="flex gap-4">
                  <div
                    className={`h-11 w-11 rounded-full flex items-center justify-center ${meta.bg}`}
                  >
                    {meta.icon}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">{n.title}</p>
                    <p className="text-muted mt-1">{n.message}</p>
                    <p className="text-xs text-muted mt-2">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>

                  {n.read && (
                    <CheckCircle size={16} className="text-brandGreen mt-1" />
                  )}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default Notifications
