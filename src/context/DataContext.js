import { createContext, useContext, useEffect, useRef, useState } from "react"
import {
  doc,
  onSnapshot,
  collection,
  query,
  where
} from "firebase/firestore"
import { db } from "../firebase"
import { AuthContext } from "./AuthContext"
import toast from "react-hot-toast"

export const DataContext = createContext()

function DataProvider({ children }) {
  const { user } = useContext(AuthContext)
  const [data, setData] = useState(null)
  const prevUnreadRef = useRef(0)

  /* ================= USER BASE DOC ================= */
   useEffect(() => {
    if (!user) {
      setData(null)
      return
    }

    return onSnapshot(doc(db, "users", user.uid), snap => {
      setData(prev => ({
        ...prev,
        ...(snap.data() || {}),
        events: [],
        tasks: [],
        meetings: []
      }))
    })
  }, [user])


  /* ================= CLIENTS + PROJECTS ================= */
  useEffect(() => {
    if (!user) return

    const clientsRef = collection(db, "users", user.uid, "clients")

    const unsub = onSnapshot(clientsRef, snap => {
      const unsubProjects = []

      const clients = snap.docs.map(c => {
        const client = { id: c.id, ...c.data(), projects: [] }

        const projectsRef = collection(
          db,
          "users",
          user.uid,
          "clients",
          c.id,
          "projects"
        )

        const u = onSnapshot(projectsRef, pSnap => {
          client.projects = pSnap.docs.map(p => ({
            id: p.id,
            ...p.data()
          }))

          setData(prev => {
            if (!prev) return prev

            const updatedClients = prev.clients
              ? prev.clients.map(x => x.id === client.id ? client : x)
              : [client]

            return {
              ...prev,
              clients: updatedClients
            }
          })
        })

        unsubProjects.push(u)
        return client
      })

      setData(prev => ({
        ...prev,
        clients
      }))

      return () => unsubProjects.forEach(u => u())
    })

    return () => unsub()
  }, [user])

  /* ================= EVENTS → TASKS & MEETINGS ================= */
useEffect(() => {
  if (!user) return

  return onSnapshot(
    collection(db, "users", user.uid, "events"),
    snap => {
      const events = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }))

      const tasks = events.filter(e => e.type === "task")
      const meetings = events.filter(e => e.type === "meeting")

      setData(prev => ({
        ...prev,
        events,
        tasks,
        meetings
      }))
    }
  )
}, [user])


  /* ================= PAYMENTS (DERIVED) ================= */
  useEffect(() => {
    if (!data?.clients) return

    const allProjects = data.clients.flatMap(c => c.projects || [])

    const received = allProjects
      .filter(p => p.paymentStatus === "paid")
      .reduce((s, p) => s + Number(p.value || 0), 0)

    const pending = allProjects
      .filter(p => p.paymentStatus !== "paid")
      .reduce((s, p) => s + Number(p.value || 0), 0)

    setData(prev => ({
      ...prev,
      payments: {
        received,
        pending,
        clients: data.clients.map(c => ({
          name: c.name,
          amount: (c.projects || [])
            .filter(p => p.paymentStatus !== "paid")
            .reduce((s, p) => s + Number(p.value || 0), 0)
        }))
      }
    }))
  }, [data?.clients])
  /* ================= STATS (DERIVED) ================= */
useEffect(() => {
  if (!data?.clients) return

  const allProjects = data.clients.flatMap(c => c.projects || [])

  const completedProjects = allProjects.filter(
    p => p.status === "completed"
  ).length

  const pendingProjects = allProjects.filter(
    p => p.status !== "completed"
  ).length

  setData(prev => ({
    ...prev,
    stats: {
      revenue: prev.payments?.received || 0,
      clients: data.clients.length,
      completed: completedProjects,
      pending: pendingProjects
    }
  }))
}, [data?.clients, data?.payments])


  /* ================= NOTIFICATIONS ================= */
  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, "users", user.uid, "notifications"),
      where("read", "==", false)
    )

    const unsub = onSnapshot(q, snap => {
      if (snap.size > prevUnreadRef.current) {
        toast.success("New notification")
      }
      prevUnreadRef.current = snap.size
    })

    return () => unsub()
  }, [user])

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  )
}

export default DataProvider
