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
import { Bell, DollarSign, FileText, Folder } from "lucide-react"
import { useNavigate } from "react-router-dom"

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState("all")
  const navigate = useNavigate()
  const user = auth.currentUser

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, "users", user.uid, "notifications"),
      orderBy("createdAt", "desc")
    )

    const unsub = onSnapshot(q, snap => {
      setNotifications(
        snap.docs.map(d => ({ id: d.id, ...d.data() }))
      )
    })

    return () => unsub()
  }, [user])

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

  const iconMap = {
    payment: {
      icon: <DollarSign className="text-green" />,
      bg: "bg-green/10"
    },
    invoice: {
      icon: <FileText className="text-red-500" />,
      bg: "bg-red-500/10"
    },
    project: {
      icon: <Folder className="text-blue" />,
      bg: "bg-blue/10"
    }
  }

  const timeAgo = (timestamp) => {
    const diff = Date.now() - timestamp.toDate().getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return `${days}d ago`
  }

  const filtered =
    filter === "unread"
      ? notifications.filter(n => !n.read)
      : notifications

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="bg-bg min-h-screen text-white px-4 pb-24">

      {/* PAGE WRAPPER */}
      <div className="pt-6 max-w-5xl mx-auto">

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
              <p className="text-muted text-sm mt-1">
                Updates about payments, invoices and projects
              </p>
            </div>
          </div>

          <div className="relative">
            <Bell />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green text-xs
                               h-5 w-5 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full text-sm transition ${
              filter === "all"
                ? "bg-green/10 text-green"
                : "text-muted hover:text-white"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-1.5 rounded-full text-sm transition ${
              filter === "unread"
                ? "bg-green/10 text-green"
                : "text-muted hover:text-white"
            }`}
          >
            Unread
          </button>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="ml-auto text-sm text-muted hover:text-white transition"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="space-y-4">
          {filtered.map(n => {
            const meta = iconMap[n.type]

            return (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`card p-5 cursor-pointer transition
                  hover:bg-white/[0.04]
                  ${!n.read ? "border-l-4 border-green" : ""}
                `}
              >
                <div className="flex gap-4">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center ${meta.bg}`}
                  >
                    {meta.icon}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">{n.title}</p>
                    <p className="text-muted mt-1">{n.message}</p>
                    <p className="text-sm text-muted mt-3">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>

                  {n.read && (
                    <span className="text-muted text-sm">✓</span>
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
