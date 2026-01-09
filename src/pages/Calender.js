import { useEffect, useMemo, useState } from "react"
import { auth, db } from "../firebase"
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "firebase/firestore"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowLeft,
  Trash,
  Check
} from "lucide-react"
import { useNavigate } from "react-router-dom"

/* ================= COLORS ================= */
const COLORS = {
  payment: "bg-red-500",
  work: "bg-yellow-400",
  scheduled: "bg-blue-500",
  completed: "bg-green-500"
}

function Calendar() {
  const user = auth.currentUser
  const navigate = useNavigate()

  const [events, setEvents] = useState([])
  const [current, setCurrent] = useState(new Date())
  const [view, setView] = useState("month")

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    title: "",
    client: "",
    date: "",
    time: "",
    type: "task"
  })

  /* ================= FETCH EVENTS ================= */
  useEffect(() => {
    if (!user) return

    return onSnapshot(
      collection(db, "users", user.uid, "events"),
      snap => setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
  }, [user])

  /* ================= SAVE EVENT ================= */
  const saveEvent = async () => {
    if (!form.title || !form.date) return

    await addDoc(collection(db, "users", user.uid, "events"), {
      title: form.title,
      client: form.client || "General",
      date: form.date,
      time: form.time || null,
      type: form.type,
      category:
        form.type === "meeting"
          ? "scheduled"
          : form.type === "payment"
          ? "payment"
          : "work",
      createdAt: serverTimestamp()
    })

    setShowModal(false)
    setForm({ title: "", client: "", date: "", time: "", type: "task" })
  }

  const markCompleted = async (id) => {
    await updateDoc(doc(db, "users", user.uid, "events", id), {
      category: "completed"
    })
  }

  const deleteEvent = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "events", id))
  }

  /* ================= CALENDAR LOGIC ================= */
  const year = current.getFullYear()
  const month = current.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startDay = new Date(year, month, 1).getDay()

  const monthLabel = current.toLocaleString("default", {
    month: "long",
    year: "numeric"
  })

  const dateKey = (d) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`

  const eventsForDate = (d) =>
    events.filter(e => e.date === dateKey(d))

  /* ================= WEEK VIEW ================= */
  const weekDays = useMemo(() => {
    const start = new Date(current)
    start.setDate(start.getDate() - start.getDay())
    return [...Array(7)].map((_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      return d
    })
  }, [current])

  return (
    <div className="bg-bg min-h-screen text-white px-4 pb-24">
      <div className="pt-6 max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-lg">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-heading">Calendar</h1>
              <p className="text-muted text-sm">Track deadlines & meetings</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setView(v => v === "month" ? "week" : "month")}
              className="px-4 py-2 bg-white/10 rounded-lg"
            >
              {view === "month" ? "Week View" : "Month View"}
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="bg-green px-4 py-2 rounded-lg flex gap-2"
            >
              <Plus size={16} /> Add Event
            </button>
          </div>
        </div>

        {/* LEGEND */}
        <div className="flex gap-6 text-sm mb-4">
          <Legend type="payment" label="Payment pending" />
          <Legend type="work" label="Work due" />
          <Legend type="scheduled" label="Scheduled" />
          <Legend type="completed" label="Completed" />
        </div>

        {/* ================= MONTH VIEW ================= */}
        {view === "month" && (
          <div className="card p-6 mx-auto w-fit">

            <div className="flex justify-between mb-4">
              <button onClick={() => setCurrent(new Date(year, month - 1))}>
                <ChevronLeft />
              </button>
              <h2 className="font-semibold">{monthLabel}</h2>
              <button onClick={() => setCurrent(new Date(year, month + 1))}>
                <ChevronRight />
              </button>
            </div>

            <div className="grid grid-cols-7 text-center text-muted text-sm mb-2">
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d}>{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {[...Array(startDay)].map((_, i) => <div key={i} />)}

              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1
                const dayEvents = eventsForDate(day)

                return (
                  <div
                    key={day}
                    onClick={() => {
                      setForm(f => ({ ...f, date: dateKey(day) }))
                      setShowModal(true)
                    }}
                    className="relative h-16 w-16 rounded-xl cursor-pointer flex flex-col items-center justify-center hover:bg-white/5"
                  >
                    <span className="text-sm font-medium">{day}</span>

                    {/* DOTS */}
                    <div className="flex gap-1 mt-2">
                      {["payment","work","scheduled","completed"].map(type =>
                        dayEvents.some(e => e.category === type) ? (
                          <span
                            key={type}
                            className={`h-2.5 w-2.5 rounded-full ${COLORS[type]} ring-2 ring-white/20`}
                          />
                        ) : null
                      )}
                    </div>

                    <Plus size={14} className="absolute top-1 right-1 opacity-0 hover:opacity-100" />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ================= WEEK VIEW ================= */}
        {view === "week" && (
          <div className="grid grid-cols-7 gap-4 mt-6">
            {weekDays.map(d => {
              const key = d.toISOString().split("T")[0]
              const dayEvents = events.filter(e => e.date === key)

              return (
                <div key={key} className="card p-4">
                  <p className="font-semibold mb-2">{d.toDateString()}</p>

                  {dayEvents.map(e => (
                    <div key={e.id} className="bg-white/5 p-3 rounded-lg mb-2">
                      <p className="font-medium">{e.title}</p>
                      <p className="text-sm text-muted">{e.client}</p>
                      {e.time && <p className="text-xs">{e.time}</p>}

                      <div className="flex gap-2 mt-2">
                        {e.category !== "completed" && (
                          <button onClick={() => markCompleted(e.id)}>
                            <Check size={14} className="text-green" />
                          </button>
                        )}
                        <button onClick={() => deleteEvent(e.id)}>
                          <Trash size={14} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )}
      </div>



      {/* ================= ADD MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="card p-6 w-full max-w-md">
            <h2 className="font-semibold mb-4">Add Event</h2>

            <div className="space-y-3">
              <input className="input" placeholder="Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} />

              <input className="input" placeholder="Client"
                value={form.client}
                onChange={e => setForm({ ...form, client: e.target.value })} />

              <input type="date" className="input"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })} />

              <input type="time" className="input"
                value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })} />

              <select className="input"
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="task">Task</option>
                <option value="meeting">Meeting</option>
                <option value="payment">Payment</option>
              </select>

              <div className="flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-white/10 rounded-lg">
                  Cancel
                </button>
                <button onClick={saveEvent} className="px-4 py-2 bg-green rounded-lg">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Legend({ type, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-3 w-3 rounded-full ${COLORS[type]} ring-2 ring-white/20`}
      />
      <span className="text-muted">{label}</span>
    </div>
  )
}

export default Calendar
