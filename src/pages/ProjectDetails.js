import { useEffect, useState } from "react"
import { auth, db } from "../firebase"
import { doc, collection, onSnapshot } from "firebase/firestore"
import { useParams, useNavigate } from "react-router-dom"
import {
  Bell,
  Pencil,
  Calendar,
  User,
  Repeat,
  Upload,
  Copy,
  ExternalLink
} from "lucide-react"

function ProjectDetails() {
  const { clientId, projectId } = useParams()
  const navigate = useNavigate()
  const user = auth.currentUser

  const [project, setProject] = useState(null)
  const [uploads, setUploads] = useState([])

  useEffect(() => {
    if (!user) return

    const ref = doc(
      db,
      "users",
      user.uid,
      "clients",
      clientId,
      "projects",
      projectId
    )

    const unsub = onSnapshot(ref, snap => setProject(snap.data()))

    const uRef = collection(ref, "uploads")
    const unsubUploads = onSnapshot(uRef, snap => {
      setUploads(snap.docs.map(d => d.data()))
    })

    return () => {
      unsub()
      unsubUploads()
    }
  }, [user, clientId, projectId])

  if (!project) return null

  return (
    <div className="bg-bg min-h-screen text-white px-4 pb-24">
      <div className="pt-6 max-w-4xl mx-auto">

        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-muted hover:text-white transition"
          >
            ← Back
          </button>

          <h1 className="text-lg font-heading">Project Details</h1>

          <Bell className="text-muted" />
        </div>

        {/* PROJECT CARD */}
        <div className="card p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-heading mb-2">
                {project.title}
              </h2>

              <span className="inline-block px-3 py-1 text-xs rounded-full bg-white/10">
                {project.status === "completed"
                  ? "Completed"
                  : "In Progress"}
              </span>
            </div>

            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10">
              <Pencil size={18} />
            </button>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <User size={16} className="text-muted" />
              <span className="text-green">{project.clientName}</span>
            </p>

            <p className="flex items-center gap-2">
              <Calendar size={16} className="text-muted" />
              Due: {project.dueDate}
            </p>

            <p className="flex items-center gap-2">
              <Repeat size={16} className="text-muted" />
              {project.revisions || 0} revisions
            </p>
          </div>

          <div className="mt-4 bg-white/5 p-4 rounded-xl flex justify-between">
            <span className="text-muted">Project Value</span>
            <span className="text-green font-semibold text-lg">
              ${project.value}
            </span>
          </div>
        </div>

        {/* INVOICE STATUS */}
        <div className="card p-6 mb-8">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              💲 Invoice Status
            </h3>

            <span className="px-3 py-1 rounded-full text-xs bg-red-500 text-white">
              UNPAID
            </span>
          </div>

          <p className="text-2xl font-bold mb-1">
            ${project.value}
          </p>

          <p className="text-muted text-sm mb-3">
            Due: {project.dueDate}
          </p>

          <p className="text-sm text-muted flex items-center gap-2">
            ⏰ Automatic reminders sent every 12 hours until payment
          </p>
        </div>

        {/* UPLOADS HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Uploads</h3>

          <button className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10">
            <Upload size={16} /> New Upload
          </button>
        </div>

        {/* UPLOAD LIST */}
        <div className="space-y-4">
          {uploads.map((u, i) => (
            <div
              key={i}
              className="card p-5 hover:bg-white/[0.04] transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-green/20 flex items-center justify-center">
                  ▶
                </div>

                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-muted text-sm">
                    {u.size} • {u.createdAt}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-white/5 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-white/10">
                  <Copy size={16} /> Copy Link
                </button>

                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10">
                  <ExternalLink size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default ProjectDetails
