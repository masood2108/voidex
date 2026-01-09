import { useEffect, useState } from "react"
import { auth, db } from "../firebase"
import {
  doc,
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
   updateDoc
} from "firebase/firestore"
import { useNavigate, useParams } from "react-router-dom"
import {
  Mail,
  Phone,
  Edit,
  Trash,
  Bell,
  Plus,
  X
} from "lucide-react"


function ClientDetails() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const user = auth.currentUser

  const [client, setClient] = useState(null)
  const [projects, setProjects] = useState([])
  const [showAddProject, setShowAddProject] = useState(false)

  const [projectForm, setProjectForm] = useState({
    title: "",
    value: "",
    dueDate: "",
    status: "in-progress"
  })

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!user) return

    const ref = doc(db, "users", user.uid, "clients", clientId)
    const unsub = onSnapshot(ref, snap => setClient(snap.data()))

    const pRef = collection(ref, "projects")
    const unsubProjects = onSnapshot(pRef, snap => {
      setProjects(
        snap.docs.map(d => ({ id: d.id, ...d.data() }))
      )
    })

    return () => {
      unsub()
      unsubProjects()
    }
  }, [user, clientId])

  if (!client) return null

  /* ================= ADD PROJECT ================= */
  const addProject = async () => {
    if (!projectForm.title || !projectForm.value) return

    await addDoc(
      collection(db, "users", user.uid, "clients", clientId, "projects"),
      {
        title: projectForm.title,
        value: Number(projectForm.value),
        dueDate: projectForm.dueDate,
        status: projectForm.status,          // project progress
        paymentStatus: "unpaid",             // 🔥 ADD THIS

        createdAt: serverTimestamp()
      }
    )

    setProjectForm({
      title: "",
      value: "",
      dueDate: "",
      status: "in-progress"
    })
    setShowAddProject(false)
  }
const totalPaid = projects
  .filter(p => p.paymentStatus === "paid")
  .reduce((sum, p) => sum + Number(p.value || 0), 0)

  return (
    <div className="bg-bg min-h-screen text-white px-4 pb-24">

      {/* PAGE WRAPPER */}
      <div className="pt-6 max-w-4xl mx-auto">

        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-muted hover:text-white"
          >
            ← Back
          </button>

          <h1 className="text-lg font-heading">Client Details</h1>

          <Bell className="text-muted" />
        </div>

        {/* CLIENT CARD */}
        <div className="card p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-heading">{client.name}</h2>
              <p className="text-muted text-sm">
                Client since {client.since || "—"}
              </p>
            </div>

            <div className="flex gap-2">
              <button className="icon-btn">
                <Edit size={18} />
              </button>
              <button className="icon-btn text-red-500">
                <Trash size={18} />
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <Mail size={16} /> {client.email}
            </p>
            {client.phone && (
              <p className="flex items-center gap-2">
                <Phone size={16} /> {client.phone}
              </p>
            )}
          </div>

          {client.notes && (
            <div className="mt-4 bg-white/5 p-4 rounded-xl">
              <p className="text-muted text-sm mb-1">Notes</p>
              <p>{client.notes}</p>
            </div>
          )}
        </div>
          

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold">
              {projects.length}
            </p>
            <p className="text-muted text-sm">Total Projects</p>
          </div>

          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-green">
  ${totalPaid}
</p>
            <p className="text-muted text-sm">Total Paid</p>
          </div>
        </div>

        {/* PROJECTS HEADER */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Projects</h3>

          <button
            onClick={() => setShowAddProject(true)}
            className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10"
          >
            <Plus size={16} /> Add Project
          </button>
        </div>

        {/* PROJECT LIST */}
        <div className="space-y-3 mb-10">
          {projects.map(p => (
            <div
              key={p.id}
              onClick={() =>
                navigate(`/clients/${clientId}/projects/${p.id}`)
              }
              className="card p-5 cursor-pointer flex justify-between items-center hover:bg-white/[0.04]"
            >
              <div>
                <p className="font-medium">{p.title}</p>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs rounded-full
                    ${
                      p.status === "completed"
                        ? "bg-green/20 text-green"
                        : "bg-white/10 text-muted"
                    }`}
                >
                  {p.status === "completed"
                    ? "Completed"
                    : "In Progress"}
                </span>
              </div>

              <span className="text-muted">${p.value}</span>
            </div>
          ))}
        </div>

{/* PAYMENT HISTORY */}
{/* PAYMENT HISTORY */}
<h3 className="text-lg font-semibold mb-3">
  Payment History
</h3>

<div className="space-y-3">
  {projects.map(p => (
    <div
      key={p.id}
      className="card p-5 flex justify-between items-center"
    >
      
      {/* LEFT */}
      <div>
        <p className="font-medium">{p.title}</p>
        <p className="text-muted text-sm">
          Due: {p.dueDate || "—"}
        </p>
      </div>

      {/* RIGHT */}
      <div className="text-right space-y-2">
        <p className="font-medium">${p.value}</p>

        {p.paymentStatus === "paid" ? (
  <button
    onClick={async (e) => {
      e.stopPropagation()

      await updateDoc(
        doc(
          db,
          "users",
          user.uid,
          "clients",
          clientId,
          "projects",
          p.id
        ),
        { paymentStatus: "unpaid" }
      )
    }}
    className="px-3 py-1 text-xs rounded-full
               bg-white/10 text-muted
               hover:bg-white/20 transition"
  >
    Undo Paid
  </button>
) : (
  <button
    onClick={async (e) => {
      e.stopPropagation()

      const projectRef = doc(
        db,
        "users",
        user.uid,
        "clients",
        clientId,
        "projects",
        p.id
      )

      await updateDoc(projectRef, {
        paymentStatus: "paid"
      })

      await addDoc(
        collection(db, "users", user.uid, "notifications"),
        {
          type: "payment",
          title: "Payment received",
          message: `${p.title} — $${p.value} received`,
          read: false,
          createdAt: serverTimestamp()
        }
      )
    }}
    className="px-3 py-1 text-xs rounded-full
               bg-red-500 text-white
               hover:bg-red-600 transition"
  >
    Mark as Paid
  </button>
)}

      </div>

    </div>
  ))}
</div>
</div>

      {/* ================= ADD PROJECT MODAL ================= */}
      {showAddProject && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="card w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading text-lg">Add Project</h2>
              <button onClick={() => setShowAddProject(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-3">
              <input
                placeholder="Project title"
                className="input"
                value={projectForm.title}
                onChange={e =>
                  setProjectForm({ ...projectForm, title: e.target.value })
                }
              />

              <input
                placeholder="Project value"
                className="input"
                value={projectForm.value}
                onChange={e =>
                  setProjectForm({ ...projectForm, value: e.target.value })
                }
              />

              <input
                type="date"
                className="input"
                value={projectForm.dueDate}
                onChange={e =>
                  setProjectForm({ ...projectForm, dueDate: e.target.value })
                }
              />

              <select
                className="input"
                value={projectForm.status}
                onChange={e =>
                  setProjectForm({ ...projectForm, status: e.target.value })
                }
              >
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <button
                onClick={addProject}
                className="w-full bg-green py-2 rounded-lg font-medium"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientDetails
