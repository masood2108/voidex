import { useEffect, useState } from "react"
import { auth, db } from "../firebase"
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import {
  Search,
  ChevronRight,
  Plus,
  Mail,
  Trash2,
  X
} from "lucide-react"

function Clients() {
  const [clients, setClients] = useState([])
  const [search, setSearch] = useState("")
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  })

  const navigate = useNavigate()
  const user = auth.currentUser

  /* ================= FETCH CLIENTS (REALTIME) ================= */
  useEffect(() => {
    if (!user) return

    const ref = collection(db, "users", user.uid, "clients")
    const unsub = onSnapshot(ref, snap => {
      setClients(
        snap.docs.map(d => ({ id: d.id, ...d.data() }))
      )
    })

    return () => unsub()
  }, [user])

  /* ================= ADD CLIENT ================= */
  const addClient = async () => {
    if (!form.name || !form.email) return

    await addDoc(
      collection(db, "users", user.uid, "clients"),
      {
        name: form.name,
        email: form.email,
        phone: form.phone,
        totalProjects: 0,
        totalPaid: 0,
        createdAt: serverTimestamp()
      }
    )

    setForm({ name: "", email: "", phone: "" })
    setShowAdd(false)
  }

  /* ================= DELETE CLIENT ================= */
  const deleteClient = async (id) => {
    const ok = window.confirm("Delete this client permanently?")
    if (!ok) return

    await deleteDoc(
      doc(db, "users", user.uid, "clients", id)
    )
  }

  /* ================= FILTER ================= */
  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-bg min-h-screen text-white px-4 pb-24">

      {/* PAGE WRAPPER */}
      <div className="pt-6 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-muted hover:text-white transition mb-2"
          >
            ← Back
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading">Clients</h1>
              <p className="text-muted text-sm mt-1">
                Manage your clients and their projects
              </p>
            </div>

            <button
              onClick={() => setShowAdd(true)}
              className="bg-green px-4 py-2 rounded-lg
                         flex items-center gap-2
                         hover:bg-green/90 transition"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative mb-6">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            size={16}
          />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full bg-white/5 pl-11 py-3 rounded-xl
                       outline-none focus:ring-2 focus:ring-green/40"
          />
        </div>

        {/* CLIENT LIST */}
        <div className="space-y-4">
          {filtered.map(c => (
            <div
              key={c.id}
              onClick={() => navigate(`/clients/${c.id}`)}
              className="card p-5 cursor-pointer
                         flex justify-between items-center
                         hover:bg-white/[0.04] transition"
            >
              <div>
                <p className="font-medium text-lg">{c.name}</p>

                <p className="text-sm text-muted flex items-center gap-1 mt-1">
                  <Mail size={14} /> {c.email}
                </p>

                <p className="text-sm mt-3">
                  {c.totalProjects} projects
                  <span className="text-green ml-3 font-medium">
                    ${c.totalPaid} paid
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <ChevronRight className="text-muted" />

                <Trash2
                  size={18}
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteClient(c.id)
                  }}
                  className="text-red-500 hover:text-red-400 transition"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ADD CLIENT MODAL ================= */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/60
                        flex items-center justify-center px-4">
          <div className="card w-full max-w-md p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-heading">Add Client</h2>
              <button onClick={() => setShowAdd(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-3">
              <input
                placeholder="Client name"
                className="input"
                value={form.name}
                onChange={e =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                placeholder="Email"
                className="input"
                value={form.email}
                onChange={e =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                placeholder="Phone (optional)"
                className="input"
                value={form.phone}
                onChange={e =>
                  setForm({ ...form, phone: e.target.value })
                }
              />

              <button
                onClick={addClient}
                className="w-full bg-green py-2 rounded-lg font-medium"
              >
                Add Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Clients
